/*
	TODO:
	- acutally manipulate DOM
	- countdown-timer
	- performance improvements?
*/

// returns local offset in ms (as positive value)
var offset = new Date(Date.now()).getTimezoneOffset();
function getOffset () {
	return -(offset * 60 * 1000);
};

var startTime = 0;
function getStartTime () {
	return startTime;
};

// 0 is off; 1 is on; 2 is pause
var state = 0;
function getState () {
	return state;
};

function zeroPad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
};

function stopwatchButton () {
	if (startTime == 0) {
		startTime = Date.now();
	};
	setInterval(function () {
		var timeDisplay = document.getElementById('stopwatch');
		var timeSinceStart = Date.now() - getStartTime() - getOffset();
		var date = new Date(timeSinceStart);
		console.log(zeroPad(date.getHours(), 2)
			+ ':' + zeroPad(date.getMinutes(), 2)
			+ ':' + zeroPad(date.getSeconds(), 2)
			+ ':' + zeroPad(date.getMilliseconds(), 3));
	}, 100);
};
