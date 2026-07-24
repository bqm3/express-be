'use strict';

/**
 * Drop + recreate DB, rồi import src/database/backup_express.sql
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const db = process.env.DB_DATABASE || 'express';
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';

  const sqlPath = path.resolve(__dirname, '../src/database/backup_express.sql');
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`Backup not found: ${sqlPath}`);
  }

  const root = await mysql.createConnection({ host, port, user, password });
  await root.query(`DROP DATABASE IF EXISTS \`${db}\``);
  await root.query(
    `CREATE DATABASE \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await root.end();

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database: db,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(sqlPath, 'utf8');
  await conn.query(sql);
  await conn.end();

  console.log(`Database ${db} restored from backup_express.sql`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
