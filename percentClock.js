window.addEventListener('load', function load(){
	window.removeEventListener('load', load, false);

	var fullDay = 86400;
	var fullMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var fullYear = 31536000;
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var clocks = ["day", "month", "year"];

	function determineValues(){
		var newDate = new Date();
		var percentTime = [];
		percentTime[0] = [];
		percentTime[1] = [];

		// Leap Year
		var year = newDate.getFullYear();
		if(!(year % 4 != 0 || year % 100 == 0 && year % 400 != 0)){
			fullMonth[1] = 29;
			fullYear = 31622400;
		}

		var hours = newDate.getHours();
		hours = (hours * 60) * 60;
		var minutes = newDate.getMinutes();
		minutes = minutes * 60;
		var seconds = newDate.getSeconds();
		var currentTime = hours + minutes + seconds;

		var dayOfWeek = newDate.getDay();

		percentTime[0][0] = currentTime / fullDay;
		percentTime[1][0] = dayNames[dayOfWeek];

		var month = newDate.getMonth();
		var currentMonth = fullMonth[month];
		currentMonth = currentMonth * fullDay;
		var dayOfMonth = newDate.getDate();
		dayOfMonth = dayOfMonth * fullDay + currentTime;

		percentTime[0][1] = dayOfMonth / currentMonth;
		percentTime[1][1] = monthNames[month];

		var dayOfYear = dayOfMonth;
		for(var i = 0; i <= (month - 1); i++){
			dayOfYear = dayOfYear + fullMonth[i] * fullDay;
		}

		percentTime[0][2] = dayOfYear / fullYear;
		percentTime[1][2] = year;

		return percentTime;
	}

	function printTime(i){
		percentTime = determineValues();
		thisTime = percentTime[0][i] * 100;
		thisTime = thisTime.toFixed(2);
		thisTime = thisTime + "%";
		var time = document.getElementById( clocks[i] + 'Time');
		time.innerHTML = thisTime;

		var text = document.getElementById( clocks[i] + 'Text').getElementsByTagName('span')[0];
		text.innerHTML = percentTime[1][i];
	}

	var canvas = [];
	var context = [];
	var j = 0;

	while(j <= 2){
		canvas[j] = document.getElementById( clocks[j] + 'Canvas');
		context[j] = canvas[j].getContext('2d');
		context[j].translate(100, 100);
		context[j].rotate(-90 * Math.PI / 180);
		j++;
	}

	function drawCanvas(i){
		percentTime = determineValues();
		thisPercentTime = [];

		thisPercentTime[i] = percentTime[0][i] * 2;
		context[i].beginPath();
		context[i].clearRect(-100, -100, 200, 200);
		context[i].arc(0, 0, 90, 0, thisPercentTime[i] * Math.PI);
		context[i].stroke();
	}

	function updateTime(){
		var i = 0;
		while(i <= 2){
			printTime(i);
			drawCanvas(i);
			i++;
		}
	}

	updateTime();
	setInterval(updateTime, 1000);

}, true);