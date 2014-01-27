(function() {

	var ref = null,
		selectAll = function(selector) {
			return Array.prototype.slice.call(document.querySelectorAll(selector));
		},
		getColor = function() {
			var now = (new Date()).getTime(),
				toSunset = Math.max(Math.min(10, (weather.sunset - now) / 360000), -10),
				toSunrise = Math.max(Math.min(10, (now - weather.sunrise) / 360000), -10);
			return "hsl(6, 78%, " + Math.floor(toSunset + toSunset + 37) + "%)";
		}, refresh = function() {
			var now = new Date(),
				unixTime = now.getTime();
			if (!ref || unixTime - ref > 10000) {
				ref = unixTime;
				// adjust time
				var minutes = now.getMinutes(),
					time = now.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes);
				document.querySelector("h1").innerHTML = time;
				// adjust colors
				var color = getColor();
				selectAll("h3").forEach(function(item) {
					item.style.color = color;
				});
				document.body.style.backgroundColor = color;
			}
			requestAnimationFrame(refresh);
		};

	this.addEventListener('load', function() {
		requestAnimationFrame(refresh);
	});
})(window);