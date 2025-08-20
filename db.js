import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "giddearyan",
  database: "schooldb"
});

try {
  console.log("Connected to MySQL!");
} catch (error) {
  console.error("Error connecting to MySQL:", error);
}

export default db;
