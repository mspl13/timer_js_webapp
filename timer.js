// --------------------------------------------------
// important(/global) variables

// DOM element that contains the time as formatted string
// gets assigned at the end of the HTML file
var timedisplay;

// dialpad container div (to hide/unhide when changing mode)
// gets assigned at the end of the HTML file
var dialpad;

// timestamp for stopwatch start and countdown end
var timerStartFinishTimestamp;

// timestamp when the timer was stopped
var timerPauseTimestamp;

// DOM element of the start/pause button
// gets assigned at the end of the HTML file
var startPauseButton;

// DOM element of the lap button
// gets assigned at the end of the HTML file
var lapButton;

// DOM element of the lap container
// gets assigned at the end of the HTML file
var lapContainer;

// --------------------------------------------------
// important functions

// zero-fills the *number* to the given *size* (max. 6 leading zeros)
function zeroPad (number, size) {
  var s = "000000" + number;
  return s.substr(s.length - size);
};

// TODO
function getTimeString (timestamp) {
  var date = new Date(timestamp);
  return zeroPad(date.getUTCHours(), 2)
    + ':' + zeroPad(date.getUTCMinutes(), 2)
    + ':' + zeroPad(date.getUTCSeconds(), 2)
    + '.' + zeroPad(date.getUTCMilliseconds(), 3);
};

// TODO
function printTimedisplayFromTimestamp (timestamp) {
  // TODO (reafactoring, HTML in JS is not nice...) --> off document HTML
  var date = new Date(timestamp);
  var htmlTimeString = '<span class="time-view__timedisplay" id="timedisplay">'
    + zeroPad(date.getUTCHours(), 2)
    + ':' + zeroPad(date.getUTCMinutes(), 2)
    + ':' + zeroPad(date.getUTCSeconds(), 2)
    + '</span><span class="time-view__milliseconds">'
    + '.' + zeroPad(date.getUTCMilliseconds(), 3) + '</span>';
  timedisplay.innerHTML = htmlTimeString;
};

// TODO
function printTimedisplayFromTimeobject (timeobject) {
  var htmlTimeString = '<span class="time-view__timedisplay" id="timedisplay">'
    + zeroPad(timeobject.hours, 2)
    + ':' + zeroPad(timeobject.minutes, 2)
    + ':' + zeroPad(timeobject.seconds, 2)
    + '</span><span class="time-view__milliseconds">'
    + '.' + zeroPad(timeobject.milliseconds, 3) + '</span>';
  timedisplay.innerHTML = htmlTimeString;
}

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

// returns the current active mode as string
function getActiveMode () {
  if (countdownTab.classList.contains('menu__tab--active')) {
    return 'countdown';
  };
  return 'stopwatch';
};

// --------------------------------------------------
// dialpad functionality

// the already elapsed or still to elapse time as an object
var timeobject = {
  hours: '00',
  minutes: '00',
  seconds: '00',
  milliseconds: '00'
};

// extends the timeobject by 'number' and updates the timestring
function extendTimestringWith (number) {
  if (timeobject.hours.substr(0, 1) == '0') {
    timeobject.hours = timeobject.hours.substr(1)
      + timeobject.minutes.substr(0, 1);
    timeobject.minutes = timeobject.minutes.substr(1)
      + timeobject.seconds.substr(0, 1);
    timeobject.seconds = timeobject.seconds.substr(1) + number;
    printTimedisplayFromTimeobject(timeobject);
  };
};

// deletes the last number from timeobject and updates the timestring
function removeLastTypedNumber () {
  timeobject.seconds = timeobject.minutes.substr(1)
    + timeobject.seconds.substr(0, 1);
  timeobject.minutes = timeobject.hours.substr(1)
    + timeobject.minutes.substr(0, 1);
  timeobject.hours = '0' + timeobject.hours.substr(0, 1);
  printTimedisplayFromTimeobject(timeobject);
};

// calculates and returns the milliseconds typed into the timedisplay
function calcTimestamp (timeobject) {
  return parseInt(timeobject.hours) * 60 * 60 * 1000
    + parseInt(timeobject.minutes) * 60 * 1000
    + parseInt(timeobject.seconds) * 1000
    + parseInt(timeobject.milliseconds);
};

// --------------------------------------------------
// main timer functionality

// timerIntervalId is used to identify and stop the interval that is used
// to update the time span/string
// it is set when the interval starts
var timerIntervalId;

// DOM element for the actual lap log
// gets assigned at the end of the HTML file
var lapLog;

// starts/resumes the stopwatch
function startStopwatch () {
  if (!timerStartFinishTimestamp) {
    timerStartFinishTimestamp = Date.now();
  };
  adaptInterface();
  addPauseTime();
  timerIntervalId = window.setInterval(function () {
    printTimedisplayFromTimestamp(Date.now() - timerStartFinishTimestamp);
  }, 75);
};

// starts/resumes the countdown
function startCountdown () {
  if (!timerStartFinishTimestamp) {
    timerStartFinishTimestamp = Date.now() + calcTimestamp(timeobject);
  };
  adaptInterface();
  addPauseTime();
  timerIntervalId = window.setInterval(function () {
    var countdownTime = timerStartFinishTimestamp - Date.now();
    if (countdownTime > 0) {
      printTimedisplayFromTimestamp(countdownTime);
    } else {
      // TODO: play fanfare, etc.
      resetTimer();
    };
  }, 75);
};

// resets the timer
// resets all values to the default ones and removes hide classes from
// DOM elements if necessary
function resetTimer () {
  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
  timerStartFinishTimestamp = null;
  timerPauseTimestamp = null;
  timeobject = {
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '00'
  };
  printTimedisplayFromTimestamp(0);
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

// adapts the interface if the timer is started
function adaptInterface () {
  startPauseButton.innerHTML = 'Pause';
  startPauseButton.setAttribute('onclick', 'pauseTimer();');
  if (getActiveMode() == 'countdown') {
    dialpad.classList.add('hide');
  };
};

// pauses the timer and does all the necessary actions for each mode
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

// adds the time the timer was on pause to the main timestamp
function addPauseTime () {
  if (timerPauseTimestamp) {
    timerStartFinishTimestamp += Date.now() - timerPauseTimestamp;
    timerPauseTimestamp = null;
  };
};

// logs the current time as lap to the lap log DOM element
function logCurrentLap () {
  if (timerStartFinishTimestamp && !timerPauseTimestamp) {
    lapContainer.classList.remove('hide');
    var listNode = document.createElement('li');
    var lapTime = getTimeString(Date.now() - timerStartFinishTimestamp);
    listNode.innerHTML = lapTime;
    lapLog.insertBefore(listNode, lapLog.childNodes[0]);
  };
};
