import '@babel/polyfill';
import express from 'express';

const app = express();

app.post('/users', (req, res) => {
  const payloadData = [];
  const PAYLOAD_LIMIT = 1e6;
  req.on('data', (data) => {
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
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Payload should not be empty' });
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      res.status(415);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'The "Content-Type" header must always be "application/json"' });
      return;
    }
    try {
      const bodyString = Buffer.concat(payloadData).toString();
      JSON.parse(bodyString);
    } catch (e) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Payload should be in JSON format' });
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
