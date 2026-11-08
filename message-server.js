// ---------------
// IMPORTS
// https://stackoverflow.com/questions/65346985/syntaxerror-identifier-dirname-has-already-been-declared
// ---------------
const fs = require("fs");
const http = require("http");
const path = require("path");

// ---------------
// SHARED VARIABLES
// ---------------
const ROOT = path.join(__dirname, "directory");
const JSON_PATH = path.join(ROOT, "directory.json");

// ---------------
// HELPER FUNCTIONS
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
// https://www.geeksforgeeks.org/node-js/node-js-fs-readdirsync-method/
// ---------------
function setCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
}

function nextIndex(folder) {
    const fileNames = fs.readdirSync(folder);

    const usedNumbers = fileNames.map(name => parseInt(name, 10));

    if (usedNumbers.length === 0) {
        return 1;
    }

    return Math.max(...usedNumbers) + 1;
}

// ---------------
// SETTING SERVER ENDPOINTS
// https://developer.mozilla.org// https://stackoverflow.com/a/75849271
// ---------------
http.createServer((req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    const url = new URL(req.url, "http://localhost");
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
        const body = Buffer.concat(chunks);

        // POST audio recording
        if (req.method === "POST" && url.pathname === "/recording") {
            const name = url.searchParams.get("name") || "";
            const ext = url.searchParams.get("ext") || "webm";
            const folder = path.join(ROOT, name);
            fs.mkdirSync(folder, { recursive: true });
            const file = `${nextIndex(folder)}.${ext}`;
            fs.writeFileSync(path.join(folder, file), body);
            return res.end(file);
        }

        // POST directory entry
        if (req.method === "POST" && url.pathname === "/directory") {
            fs.writeFileSync(JSON_PATH, body);
            return res.end("saved");
        }

        // GET /list
        if (req.method === "GET" && url.pathname === "/list") {
            const name = url.searchParams.get("name") || "";
            res.setHeader("Content-Type", "application/json");
            if (!/^[a-z0-9_-]+$/i.test(name)) {
                res.statusCode = 400;
                return res.end("[]");
            }
            const folder = path.join(ROOT, name);
            if (!fs.existsSync(folder)) return res.end("[]");
            const files = fs.readdirSync(folder)
                .filter(f => /^\d+\.(webm|ogg)$/.test(f))
                .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
            return res.end(JSON.stringify(files));
        }

        // GET /file
        if (req.method === "GET" && url.pathname === "/file") {
            const name = url.searchParams.get("name") || "";
            const file = url.searchParams.get("file") || "";
            if (!/^[a-z0-9_-]+$/i.test(name) || !/^\d+\.(webm|ogg)$/.test(file)) {
                res.statusCode = 400;
                return res.end("bad request");
            }
            const filePath = path.join(ROOT, name, file);
            if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                return res.end("not found");
            }
            const data = fs.readFileSync(filePath);
            res.setHeader("Content-Type", file.endsWith(".ogg") ? "audio/ogg" : "audio/webm");
            res.setHeader("Content-Length", data.length);
            return res.end(data);
        }
    })
}).listen(3000, 
    () => console.log("[message_server.js] Message server live on: http://localhost:3000")
);