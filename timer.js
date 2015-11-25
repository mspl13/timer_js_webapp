/*
  TODO:
  - stopwatch reset button
  - timer-lap-logger
  - countdown-timer
  - performance improvements?
  - remove ugly getter-'hacks'
*/

// span that contains the stopwatch; will be set at the end of the html document
var stopwatchTimeDisplay;
// main stopwatch button; can have value 'start' and 'pause'
var stopwatchButtonElement;

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
function stopwatchButton () {
  if (!startTimestamp) {
    startTimestamp = Date.now();
  };
  // decide whether 'start' or 'pause' button was pressed
  if (stopwatchIntervalId) {
    pauseTimestamp = Date.now();
    window.clearInterval(stopwatchIntervalId);
    stopwatchButtonElement.value = "Start";
    stopwatchIntervalId = false;
  } else {
    // set everything to pause and log pause time
    stopwatchButtonElement.value = "Pause";
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
