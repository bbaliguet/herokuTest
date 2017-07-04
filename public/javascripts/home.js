(function() {
    var ref = null,
        selectAll = function(selector) {
            return Array.prototype.slice.call(
                document.querySelectorAll(selector)
            );
        },
        refresh = function() {
            var now = new Date(),
                unixTime = now.getTime();
            if (!ref || unixTime - ref > 10000) {
                ref = unixTime;
                // adjust time
                var minutes = now.getMinutes(),
                    time =
                        now.getHours() +
                        ':' +
                        (minutes < 10 ? '0' + minutes : minutes);
                document.querySelector('h1').innerHTML = time;
            }
            requestAnimationFrame(refresh);
        };

    this.addEventListener('load', function() {
        requestAnimationFrame(refresh);
    });
})(window);
