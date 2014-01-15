var request = require("request"),

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

		return url
	};

/*
 * GET home page.
 */
exports.index = function(req, res) {
	request(getTransportUrl("Lausanne", "Morges"), function(error, response, body) {
		var transports = JSON.parse(body);
		res.render('index', {
			title : "test", 
			nbConnections: transports.connections.length
		});
	});
};