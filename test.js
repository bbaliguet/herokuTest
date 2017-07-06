const request = require('request');
const options = {
    method: 'POST',
    rejectUnauthorized: false,
    url: 'https://DOMAIN/index.php',
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    gzip: true,
    form: { task: 'loadStation', sid: 'CHVD02', load: '1' }
};

request(options, function(error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
});
