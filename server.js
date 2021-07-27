const express = require("express");
const path = require("path");
require("colors");

const port = process.env.PORT || 8080;
const distDir = path.join(__dirname, "/dist/web-history-exports/");

const app = express();

app.use(express.static(distDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const server = app.listen(port, () => {
  const isLocal = process.env.PORT ? false : true;

  isLocal
    ? console.log('Server running at', `http://localhost:${port}/`.blue)
    : console.log(`Server running on port ${port}`);
});