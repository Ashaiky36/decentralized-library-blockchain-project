const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve all frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Open index.html when visiting the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});