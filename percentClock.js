window.addEventListener('load', function load() {
    window.removeEventListener('load', load, false);

    let fullDay    = 86400,
        fullMonth  = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        fullYear   = 31536000,
        dayNames   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        clocks     = ['day', 'month', 'year'],
        canvas     = [],
        context    = [];

    for (let i = 0; i <= 2; i++) {
        canvas[i]  = document.getElementById( clocks[i] + 'Canvas');
        context[i] = canvas[i].getContext('2d');
        context[i].translate(100, 100);
        context[i].rotate(-90 * Math.PI / 180);
    }

    (function drawFrame() {
        requestAnimationFrame(drawFrame);
        updateClock();
    })();

    function updateClock() {
        percentTime = determineValues();
        for (let i = 0; i <= 2; i++) {
            printTime(i, percentTime);
            drawCanvas(i, percentTime);
        }
    }

    function determineValues() {
        let newDate     = new Date(),
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

        for (let i = 0; i <= (month - 1); i++) {
            dayOfYear = dayOfYear + fullMonth[i] * fullDay;
        }

        percentTime[0][2] = dayOfYear / fullYear;
        percentTime[1][2] = year;

        return percentTime;
    }

    function printTime(i, percentTime) {
        let thisTime   = (percentTime[0][i] * 100).toFixed(2) + '%',
            time       = document.getElementById(clocks[i] + 'Time'),
            text       = document.getElementById(clocks[i] + 'Text').getElementsByTagName('span')[0];
        time.innerHTML = thisTime;
        text.innerHTML = percentTime[1][i];
    }

    function drawCanvas(i, percentTime) {
        context[i].clearRect(-100, -100, 200, 200);
        // Draw elapsed time
        context[i].fillStyle = '#eee';
        context[i].beginPath();
        context[i].moveTo(0, 0);
        context[i].arc(0, 0, 100, 0, (percentTime[0][i] * 2) * Math.PI);
        context[i].fill();
        context[i].fillStyle = '#000';
        context[i].beginPath();
        context[i].arc(0, 0, 90, 0, (percentTime[0][i] * 2) * Math.PI);
        context[i].stroke();
        // Draw 12 indices
        for (let j = 0; j < 12; j++) {
            if (j == 0 || j % 3 == 0) {
                context[i].lineWidth = 2;
            } else {
                context[i].lineWidth = 1;
            }
            context[i].beginPath();
            let angle = j * Math.PI / 6;
            context[i].rotate(angle);
            context[i].moveTo((context[i].lineWidth == 2) ? 70 : 76, 0);
            context[i].lineTo(90, 0);
            context[i].stroke();
            context[i].rotate(-angle);
        }
        // Draw 60 circles
        for (let j = 0; j < 60; j++) {
            context[i].beginPath();
            let angle = j * Math.PI / 30;
            context[i].rotate(angle);
            context[i].arc(95, 0, (j == 0 || j % 5 == 0) ? 1 : .5, 0, 2 * Math.PI);
            context[i].fill();;
            context[i].rotate(-angle);
        }
    }

}, true);
