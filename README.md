<body>
    <h1>Schools API (https://school-management-api-2-6g7f.onrender.com/)</h1>
    <p>A minimal REST API to add schools and list them sorted by distance from a user’s location. Uses the Haversine formula in MySQL for geo-sorting.</p>
    <h2>Features</h2>
    <ul>
        <li><code>POST /addSchool</code> – Validate and insert a school.</li>
        <li><code>GET /listSchools?latitude=&amp;longitude=</code> – Return schools sorted by proximity.</li>
    </ul>
    <h2>Project Structure (excerpt)</h2>
    <pre><code>.
├─ db.js        
├─ index.js   
└─ README.html  
</code></pre>
    <h2>Prerequisites</h2>
    <ul>
        <li>Node.js 18+</li>
        <li>MySQL 8+ (or 5.7+)</li>
    </ul>
    <h2>Install &amp; Run</h2>
    <ol>
        <li>Install dependencies:
            <pre><code>npm install express mysql2</code></pre>
        </li>
        <li>Create the database and table:
            <pre><code>CREATE DATABASE IF NOT EXISTS schooldb;
USE schooldb;

CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT,
    longitude FLOAT
);</code></pre>
        </li>
        <li>Configure <code>db.js</code> (example using a pool):
            <pre><code>import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD",
    database: "schooldb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;</code></pre>
        </li>
        <li>Start the server:
            <pre><code>node index.js</code></pre>
            Server listens on <code>http://localhost:3000</code>.
        </li>
    </ol>
    <h2>API</h2>
    <h3>1) Add School</h3>
    <p><strong>Endpoint:</strong> <code>POST /addSchool</code></p>
    <p><strong>Body (JSON):</strong></p>
    <pre><code>{
    "name": "Green Valley High",
    "address": "123 Main St, Pune",
    "latitude": 18.5204,
    "longitude": 73.8567
}</code></pre>
    <p><strong>cURL:</strong></p>
    <pre><code>curl -X POST http://localhost:3000/addSchool \
-H "Content-Type: application/json" \
-d '{"name":"Green Valley High","address":"123 Main St, Pune","latitude":18.5204,"longitude":73.8567}'</code></pre>
    <p><strong>Success Response:</strong></p>
    <pre><code>{
    "success": true,
    "message": "School added successfully",
    "schoolId": 1
}</code></pre>
    <h3>2) List Schools by Distance</h3>
    <p><strong>Endpoint:</strong> <code>GET /listSchools?latitude=&lt;lat&gt;&amp;longitude=&lt;lng&gt;</code></p>
    <p><strong>Example:</strong></p>
    <pre><code>GET /listSchools?latitude=18.5204&amp;longitude=73.8567</code></pre>
    <p><strong>cURL:</strong></p>
    <pre><code>curl "http://localhost:3000/listSchools?latitude=18.5204&amp;longitude=73.8567"</code></pre>
    <p><strong>Response:</strong></p>
    <pre><code>{
    "success": true,
    "count": 2,
    "schools": [
        {
            "id": 1,
            "name": "Green Valley High",
            "address": "123 Main St, Pune",
            "latitude": 18.5204,
            "longitude": 73.8567,
            "distance": 0
        }
    ]
}</code></pre>
    <h2>How Distance Sorting Works</h2>
    <p>MySQL computes distance (km) with the spherical law of cosines:</p>
    <pre><code>(6371 * acos(
    cos(radians(?)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(?)) +
    sin(radians(?)) * sin(radians(latitude))
)) AS distance</code></pre>
    <ul>
        <li>Placeholders are: <code>[userLat, userLng, userLat]</code></li>
        <li><code>6371</code> = Earth radius in kilometers.</li>
    </ul>
    <h2>Validation &amp; Errors</h2>
    <ul>
        <li>Both endpoints validate presence and types of <code>latitude</code> and <code>longitude</code>.</li>
        <li>On validation failure: HTTP 400 with a helpful message.</li>
        <li>On server/DB errors: HTTP 500.</li>
    </ul>
</body>

