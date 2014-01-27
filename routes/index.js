var Q = require("q"),
	qHttp = require("q-io/http"),

	weatherLink = "http://api.openweathermap.org/data/2.5/weather?q=Lausanne,ch&units=metric",

	getTransportUrl = function(from, to) {
		var url = "http://transport.opendata.ch/v1/connections?";
		//	today = new Date(),
		//	date = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("-"),
		//	time = [today.getHours(), today.getMinutes()].join(":");
		// build transport request 
		url += [
			"from=" + from,
			"to=" + to
			//	"time=" + time,
			//	"date=" + date
		].join("&");

		return url;
	},

	getConnection = function(connection) {
		var now = new Date(),
			departure = connection.from.departure,
			departureDate = new Date(departure),
			delay = Math.floor((departureDate.getTime() - now.getTime()) / 1000 / 60);
		if (delay < 1) {
			return;
		}
		var minutes = departureDate.getMinutes(),
			departureTime = departureDate.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes);
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

	getWeather = function(weather) {
		return {
			weather: weather.weather[0].main,
			tempMin: Math.round(weather.main.temp_min),
			tempMax: Math.round(weather.main.temp_max),
			sunrise: weather.sys.sunrise,
			sunset: weather.sys.sunset
		};
	};

/*
 * GET home page.
 */
exports.index = function(req, res) {
	var start = (new Date()).getTime();
	Q.all([
		qHttp.read(getTransportUrl("Morges", "Lausanne")).then(function(body) {
			return JSON.parse(body);
		}), qHttp.read(getTransportUrl("Lausanne", "Morges")).then(function(body) {
			return JSON.parse(body);
		}), qHttp.read(weatherLink).then(function(body) {
			return JSON.parse(body);
		})

	]).then(function(details) {
		var transports = null,
			weather = null,
			responseTime = (new Date()).getTime() - start;
		try {
			transports = [getConnections(details[0]), getConnections(details[1])];
			weather = getWeather(details[2]);
		} catch (e) {
			transports = "" + e;
		}
		res.render('index', {
			transports: transports,
			weather: weather,
			debug: JSON.stringify({
				results: transports,
				responseTime: responseTime
			})
		});
	});
};