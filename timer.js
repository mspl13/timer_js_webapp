/*
  TODO:
  - countdown-timer
  - refactoring
  - performance improvements?
  - refactoring
*/

// span that contains the stopwatch; will be set at the end of the html document
var stopwatchTimeDisplay;

// main stopwatch button; can have value 'start' and 'pause'
var stopwatchStartButton;

// logging div for laps
var lapLog;

// unix timestamp when the stopwatch starts
var startTimestamp;

// unix timestamp when stopwatch pauses
var pauseTimestamp;

// time in ms when the stopwatch stopped
var pauseTime = 0;

// stopwatchIntervalId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var stopwatchIntervalId;

// zero-fills the *number* to the given *size* (max. 2 leading zeros)
function zeroPad (number, size) {
  var s = "00" + number;
  return s.substr(s.length-size);
};

// returns the time as a string in the format hh:MM:ss:mmm
// UTC time is used to prevent timezone errors
function getCurrentTimeString () {
  var date = new Date((Date.now() - startTimestamp) - pauseTime);
  return zeroPad(date.getUTCHours(), 2)
    + ':' + zeroPad(date.getUTCMinutes(), 2)
    + ':' + zeroPad(date.getUTCSeconds(), 2)
    + ':' + zeroPad(date.getUTCMilliseconds(), 3);
};

// starts/pauses the timer depending on actual state
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
      pauseTimestamp = null;
    };
    // starting the refresh interval
    stopwatchIntervalId = window.setInterval(function () {
      stopwatchTimeDisplay.innerHTML = getCurrentTimeString();
    }, 75);
  };
};

// function to reset the stopwatch to zero so that a new timer can be started
// only works when the timer were already started
function resetStopwatch () {
  if (startTimestamp) {
    window.clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
    startTimestamp = null;
    pauseTimestamp = null;
    pauseTime = 0;
    stopwatchTimeDisplay.innerHTML = "00:00:00:000";
    stopwatchStartButton.value = "Start";
    lapLog.innerHTML = "";
  };
};

// prints the lap time to the logging div
// only works when timer were already started
function logLap () {
  if (startTimestamp && !pauseTimestamp) {
    var listNode = document.createElement('li');
    var lapTime = document.createTextNode(getCurrentTimeString());
    listNode.appendChild(lapTime);
    lapLog.insertBefore(listNode, lapLog.childNodes[0]);
  };
};
