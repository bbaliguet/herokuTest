const express = require('express');
const path = require('path');
const home = require('./routes/home');
const wind = require('./routes/wind');
const app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// middlewares
app.use(express.static('public'));

app.get('/', home.index);
app.get('/wind', wind.wind);
app.get('/proxy/:qs', wind.proxy);

const port = process.env.PORT || 8084;
app.listen(port, () => {
    console.log('Express server listening on port ' + port);
});
