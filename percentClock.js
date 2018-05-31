window.addEventListener('load', function load() {
    window.removeEventListener('load', load, false);

    var fullDay    = 86400,
        fullMonth  = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        fullYear   = 31536000,
        dayNames   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        clocks     = ['day', 'month', 'year'];

    function determineValues() {
        var newDate     = new Date(),
            year        = newDate.getFullYear(),
            month       = newDate.getMonth(),
            hours       = newDate.getHours() * 60 * 60,
            minutes     = newDate.getMinutes() * 60,
            seconds     = newDate.getSeconds(),
            currentTime = hours + minutes + seconds,
            percentTime = [],
            currentMonth, dayOfYear, dayOfMonth;

        percentTime[0] = [];
        percentTime[1] = [];

        // leap year
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
            fullMonth[1] = 29;
            fullYear     = 31622400;
        }

        percentTime[0][0] = currentTime / fullDay;
        percentTime[1][0] = dayNames[newDate.getDay()];
        currentMonth      = fullMonth[month] * fullDay;
        dayOfMonth        = (newDate.getDate() - 1) * fullDay + currentTime;
        percentTime[0][1] = dayOfMonth / currentMonth;
        percentTime[1][1] = monthNames[month];
        dayOfYear         = dayOfMonth;

        for (var i = 0; i <= (month - 1); i++) {
            dayOfYear = dayOfYear + fullMonth[i] * fullDay;
        }

        percentTime[0][2] = dayOfYear / fullYear;
        percentTime[1][2] = year;

        return percentTime;
    }

    function printTime(i, percentTime) {
        var thisTime   = (percentTime[0][i] * 100).toFixed(2) + '%',
            time       = document.getElementById(clocks[i] + 'Time'),
            text       = document.getElementById(clocks[i] + 'Text').getElementsByTagName('span')[0];
        time.innerHTML = thisTime;
        text.innerHTML = percentTime[1][i];
    }

    var canvas  = [],
        context = [],
        j       = 0;

    while (j <= 2) {
        canvas[j]  = document.getElementById( clocks[j] + 'Canvas');
        context[j] = canvas[j].getContext('2d');
        context[j].translate(100, 100);
        context[j].rotate(-90 * Math.PI / 180);
        j++;
    }

    function drawCanvas(i, percentTime) {
        var thisPercentTime = [];
        thisPercentTime[i]  = percentTime[0][i] * 2;
        context[i].beginPath();
        context[i].clearRect(-100, -100, 200, 200);
        context[i].arc(0, 0, 90, 0, thisPercentTime[i] * Math.PI);
        context[i].stroke();
    }

    function updateClock() {
        var i = 0;
        percentTime = determineValues();
        while (i <= 2) {
            printTime(i, percentTime);
            drawCanvas(i, percentTime);
            i++;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

}, true);
