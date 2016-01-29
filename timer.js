// --------------------------------------------------
// important(/global) variables

// span element that contains the time as formatted string
var timedisplay;

// dialpad container div (to hide/unhide when changing mode)
var dialpad;

// TODO
// TODO: rename, doens't fit countdown
var timerStartTimestamp;

// TODO
var timerPauseTimestamp;

// TODO
var startPauseButton;

// TODO
var lapButton;

// TODO
var lapContainer;

// --------------------------------------------------
// important functions

// zero-fills the *number* to the given *size* (max. 6 leading zeros)
function zeroPad (number, size) {
  var s = "000000" + number;
  return s.substr(s.length - size);
};

// returns the time as a string in the format hh:MM:ss:mmm
// UTC time is used to prevent timezone errors
function getCurrentTimeString (options) {
  // TODO (reafactoring, HTML in JS is not nice...)
  // TODO (refactoring, Object manipulation is expensive;maybe split here again)
  if (options.timestamp || options.timestamp == 0) {
    var date = new Date(options.timestamp);
    options.hours = date.getUTCHours();
    options.minutes = date.getUTCMinutes();
    options.seconds = date.getUTCSeconds();
    options.milliseconds = date.getUTCMilliseconds();
  };
  var htmlTimeString = '<span class="time-view__timedisplay" id="timedisplay">'
    + zeroPad(options.hours, 2)
    + ':' + zeroPad(options.minutes, 2)
    + ':' + zeroPad(options.seconds, 2)
    + '</span><span class="time-view__milliseconds">'
    + '.' + zeroPad(options.milliseconds, 3) + '</span>';
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
      // tab modifications
      countdownTab.classList.remove(menuTabActiveClass);
      stopwatchTab.classList.add(menuTabActiveClass);
      countdownTab.setAttribute('onclick', 'changeTimeDisplayTo("countdown");');
      stopwatchTab.removeAttribute('onclick');
      // dialpad modifications
      dialpad.classList.add('hide');
      // button modifications
      startPauseButton.setAttribute('onclick', 'startStopwatch();');
      lapButton.classList.remove('hide');
      resetTimer();
      break;
    case 'countdown':
      // tab modifications
      stopwatchTab.classList.remove(menuTabActiveClass);
      countdownTab.classList.add(menuTabActiveClass);
      stopwatchTab.setAttribute('onclick', 'changeTimeDisplayTo("stopwatch");');
      countdownTab.removeAttribute('onclick');
      // dialpad/lap modifications
      dialpad.classList.remove('hide');
      lapContainer.classList.add('hide');
      // button modifications
      startPauseButton.setAttribute('onclick', 'startCountdown();');
      lapButton.classList.add('hide');
      resetTimer();
      break;
    default:
      console.error('No valid mode to switch to...');
  };
};

// TODO
function getActiveMode () {
  if (countdownTab.classList.contains('menu__tab--active')) {
    return 'countdown';
  };
  return 'stopwatch';
};

// --------------------------------------------------
// dialpad functionality

// TODO
var timeobject = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '00'
};

// extends the timeobject by 'number' and updates the timestring
function extendTimestringWith (number) {
  // TODO (refactoring)
  if (timeobject.hours.substr(0, 1) == '0') {
    timeobject.hours = timeobject.hours.substr(1)
      + timeobject.minutes.substr(0, 1);
    timeobject.minutes = timeobject.minutes.substr(1)
      + timeobject.seconds.substr(0, 1);
    timeobject.seconds = timeobject.seconds.substr(1) + number;
    timedisplay.innerHTML = getCurrentTimeString(timeobject);
  };
};

// deletes the last number from timeobject and updates the timestring
function removeLastTypedNumber () {
  // TODO (refactoring)
  timeobject.seconds = timeobject.minutes.substr(1)
    + timeobject.seconds.substr(0, 1);
  timeobject.minutes = timeobject.hours.substr(1)
    + timeobject.minutes.substr(0, 1);
  timeobject.hours = '0' + timeobject.hours.substr(0, 1);
  timedisplay.innerHTML = getCurrentTimeString(timeobject);
};

// TODO
function calcTypedMilliseconds () {
  return (timeobject.hours * 60 * 60 * 1000) + (timeobject.minutes * 60 * 1000)
    + (timeobject.seconds * 1000);
}

// --------------------------------------------------
// main timer functionality

// timerIntervalId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var timerIntervalId;

// TODO
var lapLog;

// starts/resume the stopwatch
function startStopwatch () {
  if (!timerStartTimestamp) {
    timerStartTimestamp = Date.now();
  };
  adaptInterface();
  addPauseTime();
  timerIntervalId = window.setInterval(function () {
    timedisplay.innerHTML = getCurrentTimeString({
      timestamp: Date.now() - timerStartTimestamp
    });
  }, 75);
};

// TODO
function startCountdown () {
  if (!timerStartTimestamp) {
    timerStartTimestamp = Date.now() + calcTypedMilliseconds();
  };
  adaptInterface();
  addPauseTime();
  timerIntervalId = window.setInterval(function () {
    var countdownTime = timerStartTimestamp - Date.now();
    if (countdownTime > 0) {
      timedisplay.innerHTML = getCurrentTimeString({
        timestamp: countdownTime
      });
    } else {
      // TODO: play fanfare, etc.
      resetTimer();
    };
  }, 75);
};

// TODO
function resetTimer () {
  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
  timerStartTimestamp = null;
  timerPauseTimestamp = null;
  timeobject = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '00'
  };
  timedisplay.innerHTML = getCurrentTimeString({timestamp: 0});
  startPauseButton.innerHTML = 'Start';
  if (getActiveMode() == 'countdown') {
    startPauseButton.setAttribute('onclick', 'startCountdown();');
    dialpad.classList.remove('hide');
  } else if (getActiveMode() == 'stopwatch') {
    startPauseButton.setAttribute('onclick', 'startStopwatch();');
    lapLog.innerHTML = "";
    lapContainer.classList.add('hide');
  };
};

// TODO
function adaptInterface () {
  startPauseButton.innerHTML = 'Pause';
  startPauseButton.setAttribute('onclick', 'pauseTimer();');
  if (getActiveMode() == 'countdown') {
    dialpad.classList.add('hide');
  };
};

// TODO
function pauseTimer () {
  timerPauseTimestamp = Date.now();
  window.clearInterval(timerIntervalId);
  startPauseButton.innerHTML = 'Start';
  timerIntervalId = null;
  if (getActiveMode() == 'countdown') {
    startPauseButton.setAttribute('onclick', 'startCountdown();');
  } else if (getActiveMode() == 'stopwatch') {
    startPauseButton.setAttribute('onclick', 'startStopwatch();');
  };
};

// TODO
function addPauseTime () {
  if (timerPauseTimestamp) {
    timerStartTimestamp += Date.now() - timerPauseTimestamp;
    timerPauseTimestamp = null;
  };
};

// TODO
function logCurrentLap () {
  if (timerStartTimestamp && !timerPauseTimestamp) {
    lapContainer.classList.remove('hide');
    var listNode = document.createElement('li');
    var lapTime = getCurrentTimeString({
      timestamp: Date.now() - timerStartTimestamp
    });
    listNode.innerHTML = lapTime;
    lapLog.insertBefore(listNode, lapLog.childNodes[0]);
  };
};
