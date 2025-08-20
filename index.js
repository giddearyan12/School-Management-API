import express from 'express'
const app = express()
const port = 3000
import db from './db.js'

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (typeof name !== "string" || typeof address !== "string") {
      return res.status(400).json({ success: false, message: "Name and address must be strings" });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: "Latitude and Longitude must be numbers" });
    }

    const [result] = await db.query("INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",[name, address, latitude, longitude]);

    res.status(201).json({success: true, message: "School added successfully", schoolId: result.insertId}); 
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/listSchools", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    const query = `SELECT id, name, address, latitude, longitude, (6371 * acos( 
          cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )) AS distance
      FROM schools
      ORDER BY distance ASC;
    `;

    const [rows] = await db.query(query, [userLat, userLng, userLat]);

    res.json({
      success: true,
      count: rows.length,
      schools: rows
    });

  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
