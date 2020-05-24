const app = require('./app/app');

const port = process.env.PORT | 1507;

const server = app.listen(port, () => { console.log(`Listening to port ${port}`) });

module.exports = server;