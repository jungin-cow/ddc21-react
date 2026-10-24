"""ddc21.or.kr 갤러리(page_id=276) 목록과 상세 페이지를 읽어 JSON + 썸네일로 저장한다.

usage: python3 -I scrape_gallery.py OUT_DIR
  OUT_DIR/raw/        받은 HTML (재실행 시 캐시로 사용)
  OUT_DIR/gallery.json
  OUT_DIR/thumbs/<id>.jpg
"""
import html
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

from PIL import Image

SITE = 'http://ddc21.or.kr'
UPLOADS = SITE + '/wp-content/uploads/'
OUT = sys.argv[1]
RAW = os.path.join(OUT, 'raw')
THUMBS = os.path.join(OUT, 'thumbs')
os.makedirs(RAW, exist_ok=True)
os.makedirs(THUMBS, exist_ok=True)


def get(url, cache_name=None):
    path = os.path.join(RAW, cache_name) if cache_name else None
    if path and os.path.exists(path):
        with open(path, 'rb') as f:
            return f.read()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            break
        except Exception as e:  # noqa: BLE001
            print('retry', url, e, file=sys.stderr)
            time.sleep(2 * (attempt + 1))
    else:
        raise RuntimeError('failed: ' + url)
    if path:
        with open(path, 'wb') as f:
            f.write(data)
    time.sleep(0.15)
    return data


def text(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


# 1) 목록 페이지
first = get(SITE + '/?page_id=276', 'list-1.html').decode('utf-8')
categories = [
    {'slug': m.group(1), 'name': text(m.group(2))}
    for m in re.finditer(r'data-filter="\.([^"]+)" role="menuitem">(.*?)</a>', first)
]
pages = int(re.search(r'data-pages="(\d+)"', first).group(1))

posts = []
for p in range(1, pages + 1):
    h = first if p == 1 else get(f'{SITE}/?page_id=276&paged={p}', f'list-{p}.html').decode('utf-8')
    for a in re.finditer(r'<article id="portfolio-1-post-(\d+)" class="([^"]*)".*?</article>', h, re.S):
        body = a.group(0)
        link = re.search(r'class="fusion-rollover-link" href="([^"]+)">(.*?)</a>', body)
        thumb = re.search(r'<img[^>]+src="([^"]+)"', body)
        srcset = re.search(r'srcset="([^"]+)"', body)
        cats = re.findall(r'portfolio_category=([^"&]+)"', body)
        posts.append({
            'id': int(a.group(1)),
            'title': text(link.group(2)),
            'url': html.unescape(link.group(1)),
            'categories': cats,
            'updated': re.search(r'class="updated rich-snippet-hidden">([^<]+)<', body).group(1),
            '_thumb': thumb.group(1) if thumb else None,
            '_srcset': srcset.group(1) if srcset else None,
        })
    print('list page', p, len(posts), flush=True)

# 2) 상세 페이지: 사진 URL 목록
for i, post in enumerate(posts):
    h = get(post['url'], f"post-{post['id']}.html").decode('utf-8')
    # 본문 영역만: 최근 글은 Avada 갤러리, 예전 글은 본문에 직접 넣은 <img class="wp-image-N">
    start = h.find('project-description')
    end = h.find('fusion-sharing-box', start)
    body = h[start:end if end > 0 else h.find('</main>')]
    photos, seen = [], set()
    for tag in re.findall(r'<img[^>]+>', body):
        if 'wp-image-' not in tag:
            continue
        src = re.search(r'\ssrc="([^"]+)"', tag)
        w = re.search(r'\swidth="(\d+)"', tag)
        hh = re.search(r'\sheight="(\d+)"', tag)
        if not src:
            continue
        url = urllib.parse.unquote(html.unescape(src.group(1)))
        if url in seen:
            continue
        seen.add(url)
        photos.append([
            url[len(UPLOADS):] if url.startswith(UPLOADS) else url,
            int(w.group(1)) if w else 0,
            int(hh.group(1)) if hh else 0,
        ])
    post['photos'] = photos
    if i % 25 == 0:
        print('post', i, post['id'], len(photos), flush=True)


# 3) 썸네일: srcset 중 400px 이상 가장 작은 것을 받아 4:3, 400x300 으로 자름
def pick_thumb(post):
    if post['_srcset']:
        cands = []
        for part in post['_srcset'].split(','):
            u, _, w = part.strip().rpartition(' ')
            cands.append((int(w.rstrip('w')), u))
        cands.sort()
        for w, u in cands:
            if w >= 400:
                return u
        return cands[-1][1]
    if post['_thumb']:
        return post['_thumb']
    if post['photos']:
        p = post['photos'][0][0]
        return p if p.startswith('http') else UPLOADS + p
    return None


for i, post in enumerate(posts):
    dest = os.path.join(THUMBS, f"{post['id']}.jpg")
    post['thumb'] = os.path.exists(dest) or None
    if not post['thumb']:
        src = pick_thumb(post)
        if src:
            try:
                im = Image.open(io.BytesIO(get(urllib.parse.quote(src, safe=':/%?=&')))).convert('RGB')
                tw, th = 400, 300
                scale = max(tw / im.width, th / im.height)
                im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
                left, top = (im.width - tw) // 2, (im.height - th) // 2
                im.crop((left, top, left + tw, top + th)).save(dest, 'JPEG', quality=72, optimize=True, progressive=True)
                post['thumb'] = True
            except Exception as e:  # noqa: BLE001
                print('thumb fail', post['id'], src, e, file=sys.stderr)
    if i % 50 == 0:
        print('thumb', i, flush=True)

for post in posts:
    # 본문이 비어 있는 게시물은 대표 사진 한 장이라도 보여준다
    if not post['photos'] and post['_thumb']:
        url = urllib.parse.unquote(html.unescape(post['_thumb']))
        post['photos'] = [[url[len(UPLOADS):] if url.startswith(UPLOADS) else url, 0, 0]]
    post.pop('_thumb')
    post.pop('_srcset')
    post['thumb'] = bool(post['thumb'])

with open(os.path.join(OUT, 'gallery.json'), 'w', encoding='utf-8') as f:
    json.dump({'uploads': UPLOADS, 'categories': categories, 'posts': posts}, f, ensure_ascii=False, separators=(',', ':'))
print('done', len(posts), 'posts,', sum(len(p['photos']) for p in posts), 'photos')
