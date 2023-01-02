const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Web Crawler server running on http://localhost:${PORT}`);
});
