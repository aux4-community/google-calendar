// Echo server for the community/google-calendar tests.
// Usage: node mock-echo.js <port>
// Node is used instead of Python because Python 3.14's http.server leaves its
// listening socket unreachable on the macos-latest CI runner.
//
// Every request is answered with a JSON document describing what aux4 sent:
//   { method, path, authorization, contentType, body }
// so tests can assert the exact request shape without a real Google account.

const http = require("http");

const port = parseInt(process.argv[2], 10);

// Self-destruct so a stray server never outlives the test run.
setTimeout(() => process.exit(0), 90000);

function readBody(req, cb) {
  const chunks = [];
  req.on("data", c => chunks.push(c));
  req.on("end", () => cb(Buffer.concat(chunks).toString()));
}

function parseJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;
  }
}

const server = http.createServer((req, res) => {
  readBody(req, raw => {
    const payload = {
      method: req.method,
      path: req.url,
      authorization: req.headers["authorization"] || null,
      contentType: req.headers["content-type"] || null,
      body: parseJson(raw)
    };
    const data = JSON.stringify(payload, null, 2);
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    });
    res.end(data);
  });
});

server.listen(port);
