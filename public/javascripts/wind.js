(function() {
    console.log(wind);
    var container = document.querySelector('#prevision tbody');
    var provi_6 = wind.wind_data_provi_6;
    var provi_24 = wind.wind_data_provi_24;
    var unit = wind.wind_unit;
    var trad = {
        N: '↓',
        NE: '↙',
        E: '←',
        SE: '↖',
        S: '↑',
        SW: '↗',
        W: '→',
        NW: '↘'
    };
    var getDirection = function(angle) {
        if (angle > 22.5 && angle <= 67.5) return 'NE';
        if (angle > 67.5 && angle <= 112.5) return 'E';
        if (angle > 112.5 && angle <= 157.5) return 'SE';
        if (angle > 157.5 && angle <= 202.5) return 'S';
        if (angle > 202.5 && angle <= 247.5) return 'SW';
        if (angle > 247.5 && angle <= 292.5) return 'W';
        if (angle > 292.5 && angle <= 337.5) return 'NW';
        return 'N';
    };
    // prepare provi_6
    var mesured = [],
        mesuredIndex;
    provi_6[0].forEach(function(element, index) {
        mesuredIndex = Math.floor(index / 3);
        var mes = mesured[mesuredIndex];
        if (!mes) {
            mes = [];
            mesured[mesuredIndex] = mes;
        }
        mes.push(
            element + unit + ' - ' + trad[getDirection(provi_6[1][index])]
        );
    });
    provi_24[2].forEach(function(element, index) {
        var line = document.createElement('tr');
        var angle = provi_24[1][index];
        var wind = provi_24[0][index];
        line.innerHTML =
            '<td>' +
            element +
            '</td><td>' +
            wind +
            '<span class="unit">' +
            unit +
            '</span> - ' +
            trad[getDirection(angle)] +
            '<span class="angle">(' +
            angle +
            ')</span></td><td>' +
            (mesured[index] ? mesured[index].join('<br/>') : '') +
            '</td>';
        if (index === mesuredIndex) line.classList.add('now');
        if (wind < 7) line.classList.add('wind-low');
        else if (wind < 13) line.classList.add('wind-medium');
        else line.classList.add('wind-high');
        container.appendChild(line);
    });
})();
