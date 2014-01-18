var Q = require("q"),
	qHttp = require("q-io/http"),

	getTransportUrl = function(from, to) {
		var url = "http://transport.opendata.ch/v1/connections?",
			today = new Date(),
			date = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("-"),
			time = [today.getHours(), today.getMinutes()].join(":");
		// build transport request 
		url += [
			"from=" + from,
			"to=" + to,
			"time=" + time,
			"date=" + date
		].join("&");

		return url;
	},

	getConnection = function(connection) {
		try {
			var now = new Date(),
				departure = connection.sections[0].departure,
				departureDate = new Date(departure.departure),
				delay = Math.floor((departureDate.getTime() - now.getTime()) / 1000 / 60);
			if (delay < 1) {
				return false;
			}
			var minutes = departureDate.getMinutes(),
				departureTime = departureDate.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes);
			return {
				platform: departure.platform,
				delay: delay,
				time: departureTime
			};
		} catch (e) {
			return {
				noConnection : e
			}
		}
	},

	getNextTransport = function(transport) {
		var i = 0,
			connection = getConnection(transport.connections[i]);
		while (connection.noConnection) {
			i++;
			if (!transport.connections[i]) {
				return false;
			}
			connection = getConnection(transport.connections[i]);
		}
		connection.destination = transport.to.name;
		return connection;
	};

/*
 * GET home page.
 */
exports.index = function(req, res) {
	Q.all([
		qHttp.read(getTransportUrl("Morges", "Lausanne")).then(function(body) {
			return JSON.parse(body);
		}), qHttp.read(getTransportUrl("Lausanne", "Morges")).then(function(body) {
			return JSON.parse(body);
		})
	]).then(function(ways) {
		var transports = [
				getNextTransport(ways[0]),
				getNextTransport(ways[1])
			];
		res.render('index', {
			transports: transports
		});
	});
};