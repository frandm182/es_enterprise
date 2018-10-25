"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.post('/users', (req, res) => {
  const payloadData = [];
  const PAYLOAD_LIMIT = 1e6;
  req.on('data', data => {
    payloadData.push(data);
    const bodyString = Buffer.concat(payloadData).toString();

    if (bodyString.length > PAYLOAD_LIMIT) {
      res.status(413);
      res.set('Content-Type', 'text/plain');
      res.end();
      res.connection.destroy();
    }
  });
  req.on('end', () => {
    if (!payloadData.length) {
      res.status(400);
      res.set('Content-TYpe', 'application/json');
      res.json({
        message: 'Payload should not be empty'
      });
      return;
    }

    if (req.headers['content-type'] !== 'application/json') {
      res.status(415);
      res.set('Content-TYpe', 'application/json');
      res.json({
        message: 'The "Content-Type" header must always be "application/json"'
      });
      return;
    }

    try {
      const bodyString = Buffer.concat(payloadData).toString();
      JSON.parse(bodyString);
    } catch (e) {
      res.status(400);
      res.set('Content-TYpe', 'application/json');
      res.json({
        message: 'Payload should be in JSON format'
      });
    }
  });
});
app.get('/', (req, res) => {
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.end('Hello, World!');
});
app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server listening on port ${process.env.SERVER_PORT}`);
});