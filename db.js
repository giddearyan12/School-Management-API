import mysql from "mysql2/promise";
import 'dotenv/config';

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.SQLPASS,
  database: "schooldb"
});

try {
  console.log("Connected to MySQL!");
} catch (error) {
  console.error("Error connecting to MySQL:", error);
}

export default db;
