/*
  TODO:
  - stopwatch reset button
  - refactoring
  - timer-lap-logger
  - refactoring
  - countdown-timer
  - refactoring
  - performance improvements?
  - refactoring
*/

// span that contains the stopwatch; will be set at the end of the html document
var stopwatchTimeDisplay;

// main stopwatch button; can have value 'start' and 'pause'
var stopwatchStartButton;

// returns local offset in ms (as positive value)
var offset = -(new Date(Date.now()).getTimezoneOffset() * 60 * 1000);

// unix timestamp when the stopwatch starts
var startTimestamp;

// unix timestamp when stopwatch pauses
var pauseTimestamp;

// time in ms when the stopwatch stopped
var pauseTime = 0;

// zero-fills the *number* to the given *size* (max. 2 leading zeros)
function zeroPad (number, size) {
  var s = "00" + number;
  return s.substr(s.length-size);
};

// stopwatchIntervalId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var stopwatchIntervalId;
function startPauseStopwatch () {
  if (!startTimestamp) {
    startTimestamp = Date.now();
  };
  // decide whether 'start' or 'pause' button was pressed
  if (stopwatchIntervalId) {
    pauseTimestamp = Date.now();
    window.clearInterval(stopwatchIntervalId);
    stopwatchStartButton.value = "Start";
    stopwatchIntervalId = null;
  } else {
    // set everything to pause and log pause time
    stopwatchStartButton.value = "Pause";
    if (pauseTimestamp) {
      pauseTime += Date.now() - pauseTimestamp;
      pauseTimestamp = 0;
    };
    // starting the refresh interval
    stopwatchIntervalId = window.setInterval(function () {
      var timeSinceStart = (Date.now() - startTimestamp - offset) - pauseTime;
      var date = new Date(timeSinceStart);
      stopwatchTimeDisplay.innerHTML = zeroPad(date.getHours(), 2)
        + ':' + zeroPad(date.getMinutes(), 2)
        + ':' + zeroPad(date.getSeconds(), 2)
        + ':' + zeroPad(date.getMilliseconds(), 3);
    }, 100);
  };
};

function resetStopwatch () {
  if (startTimestamp) {
    window.clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
    startTimestamp = null;
    pauseTimestamp = null;
    pauseTime = 0;
    stopwatchTimeDisplay.innerHTML = "00:00:00:000";
    stopwatchStartButton.value = "Start";
  };
};
