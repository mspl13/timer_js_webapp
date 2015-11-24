/*
	TODO:
	- acutally manipulate DOM
	- pause-button with https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
	- countdown-timer
	- performance improvements?
  - remove ugly getter-'hacks'
*/

// returns local offset in ms (as positive value)
var offset = new Date(Date.now()).getTimezoneOffset();
function getOffset () {
	return -(offset * 60 * 1000);
};

// unix timestamp when the timer starts
var startTimestamp = 0;
function getStartTimestamp () {
	return startTimestamp;
};

var pauseTimestamp = 0;

var pauseTime = 0;
function getPauseTime () {
  return pauseTime;
};

// 0 is off; 1 is on; 2 is pause
var state = 0;
function getState () {
	return state;
};

// zero-fills the *number* to the given *size* (max. 2 leading zeros)
function zeroPad (number, size) {
  var s = "00" + number;
  return s.substr(s.length-size);
};

// timerIntervalId is used to identify and stop the interval that is used to update
// the time span/string
// it is set in the stopwatchButton function
var timerIntervalId;
function stopwatchButton () {
  // main timer button; can have value 'start' and 'pause'
  var timerButton = document.getElementById('timerButton');

	if (startTimestamp == 0) {
		startTimestamp = Date.now();
	};
	if (timerIntervalId) {
    timerButton.value = "Start";
    window.clearInterval(timerIntervalId);
    timerIntervalId = false;
    pauseTimestamp = Date.now();
	} else {
    // change button value to 'pause'
    timerButton.value = "Pause";
    // starting the refresh interval
    if (pauseTimestamp > 0) {
      pauseTime += Date.now() - pauseTimestamp;
      pauseTimestamp = 0;
    };
		timerIntervalId = window.setInterval(function () {
      var timeDisplay = document.getElementById('stopwatch');
			var timeSinceStart = (Date.now() - getStartTimestamp() - getOffset()) - getPauseTime();
			var date = new Date(timeSinceStart);
			timeDisplay.innerHTML = zeroPad(date.getHours(), 2)
				+ ':' + zeroPad(date.getMinutes(), 2)
				+ ':' + zeroPad(date.getSeconds(), 2)
				+ ':' + zeroPad(date.getMilliseconds(), 3);
		}, 100);
	};
};
