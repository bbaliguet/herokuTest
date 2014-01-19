(function() {

	this.addEventListener('load', function() {
		var ref = null;
		window.requestAnimationFrame(function() {
			var now = new Date(),
				unixTime = now.getTime();
			if (!ref || unixTime - ref > 10000) {
				ref = unixTime;
			} else {
				return;
			}
			var minutes = now.getMinutes(),
				time = now.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes);
			document.querySelector("h1").innerHTML = time;
		});
	});
})(window);