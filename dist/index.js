"use strict";

require("@babel/polyfill");

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestHandler(req, res) {
  if (req.method === 'POST' && req.url === '/users') {
    const payloadData = [];
    req.on('data', data => {
      payloadData.push(data);
    });
    req.on('end', () => {
      if (!payloadData.length) {
        res.writeHead(400, {
          'Content-TYpe': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'Payload should not be empty'
        }));
        return;
      }

      if (req.headers['content-type'] !== 'application/json') {
        res.writeHead(415, {
          'Content-TYpe': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'The "Content-Type" header must always be "application/json"'
        }));
        return;
      }

      try {
        const bodyString = Buffer.concat(payloadData).toString();
        JSON.parse(bodyString);
      } catch (e) {
        res.writeHead(400, {
          'Content-TYpe': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'Payload should be in JSON format'
        }));
      }
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello, World!');
  }
}

const server = _http.default.createServer(requestHandler);

server.listen(8090); // Note that there is a newline below this line