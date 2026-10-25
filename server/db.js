// MySQL(ddc21_c) 연결. 접속 정보는 .env 에서 읽는다(.env.example 참고).
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'ddc21',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'ddc21_c',
  charset: 'utf8mb4',
  connectionLimit: 5,
  // DATETIME 은 UTC 로 저장되어 있다. 드라이버가 서버 시간대로 해석하지 않도록 문자열 그대로 받는다.
  dateStrings: true,
})

export async function query(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}

// DB 'YYYY-MM-DD HH:MM:SS'(UTC) → '2026-10-04T17:34:15+09:00'(KST)
export function toKst(utc) {
  if (!utc) return null
  const d = new Date(`${utc.replace(' ', 'T')}Z`)
  return `${new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 19)}+09:00`
}
