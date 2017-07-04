var Q = require('q'),
    qHttp = require('q-io/http'),
    getTransportUrl = function(from, to) {
        var url = 'http://transport.opendata.ch/v1/connections?';
        //	today = new Date(),
        //	date = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("-"),
        //	time = [today.getHours(), today.getMinutes()].join(":");
        // build transport request
        url += [
            'from=' + from,
            'to=' + to
            //	"time=" + time,
            //	"date=" + date
        ].join('&');

        return url;
    },
    getConnection = function(connection) {
        var now = new Date(),
            departure = connection.from.departure,
            departureDate = new Date(departure),
            delay = Math.floor(
                (departureDate.getTime() - now.getTime()) / 1000 / 60
            );
        if (delay < 1) {
            return;
        }
        var minutes = departureDate.getMinutes(),
            departureTime =
                departureDate.getHours() +
                ':' +
                (minutes < 10 ? '0' + minutes : minutes);
        return {
            platform: connection.from.platform,
            transport: connection.products[0],
            delay: delay,
            time: departureTime
        };
    },
    getConnections = function(transport) {
        var validConnections = [],
            connections = transport.connections;
        for (var i = 0, l = connections.length; i < l; i++) {
            var connection = getConnection(connections[i]);
            if (connection) {
                validConnections.push(connection);
            }
        }
        return {
            destination: transport.to.name,
            connections: validConnections
        };
    },
    getProcessed = function(callback) {
        var start = new Date().getTime();
        Q.all([
            qHttp
                .read(getTransportUrl('St-Prex', 'Lausanne'))
                .then(function(body) {
                    return JSON.parse(body);
                }),
            qHttp
                .read(getTransportUrl('Lausanne', 'St-Prex'))
                .then(function(body) {
                    return JSON.parse(body);
                })
        ]).then(function(details) {
            var transports = {},
                error = null,
                responseTime = new Date().getTime() - start;
            try {
                transports = [
                    getConnections(details[0]),
                    getConnections(details[1])
                ];
            } catch (e) {
                error = e;
            }
            callback({
                transports: transports,
                debug: JSON.stringify({
                    responseTime: responseTime,
                    error: error
                })
            });
        });
    };

/*
 * GET home page.
 */
exports.index = function(req, res) {
    getProcessed(function(processed) {
        res.render('index', processed);
    });
};
