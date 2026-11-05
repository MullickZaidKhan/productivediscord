// Run: node server/src/test/server.js, then open http://127.0.0.1:8080 while logged in to the app.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "csrf-test.html");

const server = http.createServer((req, res) => {
  if (req.url !== "/" && req.url !== "/csrf-test.html") {
    res.writeHead(404);
    return res.end("Not found");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      return res.end("Could not load HTML file");
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });

    res.end(content);
  });
});

server.listen(8080, "127.0.0.1", () => {
  console.log("CSRF test page: http://127.0.0.1:8080");
});
