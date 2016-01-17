// --------------------------------------------------
// important(/global) variables

// span element that contains the time as formatted string
var timedisplay;

// dialpad container div (to hide/unhide when changing mode)
var dialpad;

// TODO
var timerStartTimestamp;

// TODO
var timerPauseTimestamp;

// TODO
var startPauseButton;

// --------------------------------------------------
// important functions

// zero-fills the *number* to the given *size* (max. 4 leading zeros)
function zeroPad (number, size) {
  var s = "00000" + number;
  return s.substr(s.length - size);
};

// returns the time as a string in the format hh:MM:ss:mmm
// UTC time is used to prevent timezone errors
function getCurrentTimeString (timestamp) {
  var date = new Date(timestamp);
  var htmlTimeString = '<span class="time-view__timedisplay" id="timedisplay">'
    + zeroPad(date.getUTCHours(), 2)
    + ':' + zeroPad(date.getUTCMinutes(), 2)
    + ':' + zeroPad(date.getUTCSeconds(), 2)
    + '</span><span class="time-view__milliseconds">'
    + '.' + zeroPad(date.getUTCMilliseconds(), 3) + '</span>';
  return htmlTimeString;
};

// --------------------------------------------------
// menu tab functionality

// menu tab to trigger stopwatch mode
var stopwatchTab;

// menu tab to trigger countdown mode
var countdownTab;

// changes the timedisplay and menu tabs to the mode required
// also: changes everything else that changes with the mode (e.g. dialpad)
// visibility
function changeTimeDisplayTo (mode) {
  var menuTabActiveClass = 'menu__tab--active';

  switch (mode) {
    case 'stopwatch':
      countdownTab.classList.remove(menuTabActiveClass);
      stopwatchTab.classList.add(menuTabActiveClass);
      countdownTab.setAttribute('onclick', 'changeTimeDisplayTo("countdown");');
      stopwatchTab.removeAttribute('onclick');
      dialpad.classList.add('hide');
      break;
    case 'countdown':
      stopwatchTab.classList.remove(menuTabActiveClass);
      countdownTab.classList.add(menuTabActiveClass);
      stopwatchTab.setAttribute('onclick', 'changeTimeDisplayTo("stopwatch");');
      countdownTab.removeAttribute('onclick');
      dialpad.classList.remove('hide');
      break;
    default:
      console.error('No valid mode to switch to...');
  };
};

// --------------------------------------------------
// dialpad functionality

// timestring that is display (zeropadded) in the timeview
var timeDisplayString = "";

// extends the timeDisplayString by 'number' and sets it
// as (time-)formatted string as content of the timeview
function extendTimestringWith (number) {
  if (timeDisplayString.charAt(1) == "0" || timeDisplayString == "") {
    timeDisplayString = zeroPad(parseInt(timeDisplayString + number), 6);
    // manipulate DOM to represent new timestring
    timedisplay.innerHTML = timeDisplayString
      .replace(/(.{2})/g,":$1")
      .substr(2);
  };
};

// takes the timeDisplayString and creates a timestamp out of it by
// parsing the numbers from it
function timeifyString () {
  var timeStringLength = timeDisplayString.length;
  // TODO why work with an object?
  var timeobj = {
    hours: parseInt(timeDisplayString.substr(timeDisplayString.length - 5, 1)),
    minutes: parseInt(timeDisplayString.substr(timeDisplayString.length - 4, 2)),
    seconds: parseInt(timeDisplayString.substr(timeDisplayString.length - 2))
  };

  return (timeobj.seconds * 1000) + (timeobj.minutes * 60 * 1000)
    + (timeobj.hours * 60 * 60 * 1000);
};

// deletes the last number from 'timeDisplayString' and updates the
// time display span element
function removeLastTypedNumber () {
  timeDisplayString = zeroPad(parseInt(timeDisplayString.slice(0, -1)), 6);
  timedisplay.innerHTML = timeDisplayString
      .replace(/(.{2})/g,":$1")
      .substr(2);
};

// --------------------------------------------------
// main timer functionality

// timerIntervalId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var timerIntervalId;

function startPauseTimer () {
  if (!timerStartTimestamp) {
    timerStartTimestamp = Date.now();
  };
  // devide whether 'start' or 'pause' timer
  if (timerIntervalId) {
    timerPauseTimestamp = Date.now();
    window.clearInterval(timerIntervalId);
    startPauseButton.innerHTML = 'Start';
    timerIntervalId = null;
  } else {
    // set everything to pause and log pause time
    startPauseButton.innerHTML = 'Pause';
    if (timerPauseTimestamp) {
      timerStartTimestamp += Date.now() - timerPauseTimestamp;
      timerPauseTimestamp = null;
    };
    timerIntervalId = window.setInterval(function () {
      timedisplay.innerHTML = getCurrentTimeString(
        Date.now() - timerStartTimestamp);
    }, 75);
  };
};

// --------------------------------------------------
// stopwatch
// // span that contains the stopwatch; will be set at the end of the html document
// var stopwatchTimeDisplay;

// // main stopwatch button; can have value 'start' and 'pause'
// var stopwatchStartButton;

// logging div for laps
var lapLog;

// // unix timestamp when the stopwatch starts
// var stopwatchStartTimestamp;

// // unix timestamp when stopwatch pauses
// var stopwatchPauseTimestamp;

// // stopwatchIntervalId is used to identify and stop the interval that is used
// // to update the time span/string
// // it is set when the interval starts
// var stopwatchIntervalId;

// // starts/pauses the stopwatch depending on actual state
// function startPauseStopwatch () {
//   if (!stopwatchStartTimestamp) {
//     stopwatchStartTimestamp = Date.now();
//   };
//   // decide whether 'start' or 'pause' button was pressed
//   if (stopwatchIntervalId) {
//     stopwatchPauseTimestamp = Date.now();
//     window.clearInterval(stopwatchIntervalId);
//     stopwatchStartButton.value = "Start";
//     stopwatchIntervalId = null;
//   } else {
//     // set everything to pause and log pause time
//     stopwatchStartButton.value = "Pause";
//     if (stopwatchPauseTimestamp) {
//       stopwatchStartTimestamp += Date.now() - stopwatchPauseTimestamp;
//       stopwatchPauseTimestamp = null;
//     };
//     // starting the refresh interval
//     stopwatchIntervalId = window.setInterval(function () {
//       stopwatchTimeDisplay.innerHTML = getCurrentTimeString(
//         Date.now() - stopwatchStartTimestamp);
//     }, 75);
//   };
// };

// function to reset the stopwatch to zero so that a new stopwatch can be
// started
// only works when the stopwatch were already started
function resetStopwatch () {
  if (stopwatchStartTimestamp) {
    window.clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
    stopwatchStartTimestamp = null;
    stopwatchPauseTimestamp = null;
    stopwatchTimeDisplay.innerHTML = "00:00:00:000";
    stopwatchStartButton.value = "Start";
    lapLog.innerHTML = "";
  };
};

// prints the lap time to the logging div
// only works when stopwatch were already started and is not paused
function logLap () {
  if (stopwatchStartTimestamp && !stopwatchPauseTimestamp) {
    var listNode = document.createElement('li');
    var lapTime = document.createTextNode(getCurrentTimeString(
      Date.now() - stopwatchStartTimestamp));
    listNode.appendChild(lapTime);
    lapLog.insertBefore(listNode, lapLog.childNodes[0]);
  };
};

// --------------------------------------------------
// countdown
// span that contains the countdown; will be set at the end of the html document
var countdownTimeDisplay;

// main stopwatch button; can have value 'start' and 'pause'
var countdownStartButton;

// unix timestamp when the countdown should be finished
var countdownFinishTimestamp;

// unix timestamp when countdown pauses
var countdownPauseTimestamp;

// countdownIntervallId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var countdownIntervallId;

// starts/pauses the countdown depending on actual state
function startPauseCountdown () {
  var countdownTime = document.getElementById('secondsInput').value * 1000
    + document.getElementById('minutesInput').value * 60 * 1000
    + document.getElementById('hoursInput').value * 60 * 60 * 1000;
  if (!countdownFinishTimestamp && countdownTime > 0) {
    countdownFinishTimestamp = Date.now() + countdownTime;
  };
  if (countdownIntervallId) {
    countdownPauseTimestamp = Date.now();
    window.clearInterval(countdownIntervallId);
    countdownStartButton.value = "Start";
    countdownIntervallId = null;
  } else if (countdownFinishTimestamp) {
    countdownStartButton.value = "Pause";
    // add pause time to finish time if available
    if (countdownPauseTimestamp) {
      countdownFinishTimestamp += Date.now() - countdownPauseTimestamp;
      countdownPauseTimestamp = null;
    };
    countdownIntervallId = window.setInterval(function () {
      var timestamp = countdownFinishTimestamp - Date.now();
      if (timestamp > 0) {
        countdownTimeDisplay.innerHTML = getCurrentTimeString(timestamp);
      } else {
        resetCountdown();
      };
    }, 75);
  };
};

// function to reset the countdown to zero so that a new countdown can be
// started
// only works when the countdown were already started
function resetCountdown () {
  if (countdownFinishTimestamp) {
    window.clearInterval(countdownIntervallId);
    countdownIntervallId = null;
    countdownStartButton.value = "Start";
    countdownTimeDisplay.innerHTML = "00:00:00:000";
    countdownFinishTimestamp = null;
    countdownPauseTimestamp = null;
  };
};
