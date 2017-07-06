const request = require('request');
const SOURCE_DOMAIN = process.env.SOURCE_DOMAIN;

function proxyWind() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            rejectUnauthorized: false,
            url: `https://${SOURCE_DOMAIN}/index.php`,
            headers: {
                'content-type':
                    'application/x-www-form-urlencoded; charset=UTF-8'
            },
            gzip: true,
            form: { task: 'loadStation', sid: 'CHVD02', load: '1' }
        };

        request(options, function(error, response, body) {
            if (error) return reject(error);
            return resolve(JSON.parse(body));
        });
    });
}

exports.wind = function(req, res) {
    proxyWind().then(function(wind) {
        // proxy image
        wind.image = wind.image.replace(
            `https://www.${SOURCE_DOMAIN}/image.php?`,
            '/proxy/'
        );
        res.render('wind', {
            wind,
            jsonWind: JSON.stringify(wind)
        });
    }, console.err);
};

exports.proxy = function(req, res) {
    request({
        url: `https://www.${SOURCE_DOMAIN}/image.php?${req.params.qs}`,
        rejectUnauthorized: false,
        headers: {
            Referer: `https://www.${SOURCE_DOMAIN}/`
        }
    })
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(res);
};
