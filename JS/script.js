timerObj = {
  minutes: 0,
  seconds: 0,
  timeId: 0
};

function soundAlarm() {
  let amount = 3;
  let audio = new Audio("../Alarm/Timer_Sound_Effect.mp3");

  function playAudio() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
  for (let i = 0; i < amount; i++) {
    setTimeout(playAudio, 1200 * i);
  }
}

function updateValue(key, value) {
  if (value < 0) {
    value = 0;
    console.log("postive numbers only");
  }
  if (key == "seconds") {
    if (value < 10) {
      value = "0" + value;
    }
    if (value > 59) {
      value = 59;
    }
  }
  if (key == "minutes") {
    if (value > 300) {
      value = 300;
    }
  }
  $("#" + key).html(value || 0);
  timerObj[key] = value;
}

(function detectChanges(key) {
  let input = "#" + key + "-input";
  $(input).change(function() {
    updateValue(key, $(input).val());
  });
  $(input).keyup(function() {
    updateValue(key, $(input).val());
  });
  return arguments.callee;
})("minutes")("seconds");

function startButton() {
  buttonsManager(["start", false], ["stop", true], ["pause", true]);
  freezeInputs();
  timerObj.timeId = setInterval(function() {
    timerObj.seconds--;
    if (timerObj.seconds < 0) {
      if (timerObj.minutes == 0) {
        soundAlarm();
        return stopButton();
      }
      timerObj.seconds = 59;
      timerObj.minutes--;
    }
    updateValue("minutes", timerObj.minutes);
    updateValue("seconds", timerObj.seconds);
  }, 1000);
}
function stopButton() {
  buttonsManager(["start", true], ["stop", false], ["pause", false]);
  unfreezeInputs();
  clearInterval(timerObj.timeId);
  updateValue("minutes", $("#minutes-input").val());
  updateValue("seconds", $("#seconds-input").val());
}
function pauseButton() {
  buttonsManager(["start", true], ["stop", true], ["pause", false]);
  clearInterval(timerObj.timeId);
}

function buttonsManager(...buttonsArray) {
  for (let i = 0; i < buttonsArray.length; i++) {
    let button = "#" + buttonsArray[i][0] + "-button";
    if (buttonsArray[i][1]) {
      $(button).removeAttr("disabled");
    } else {
      $(button).attr("disabled", "disabled");
    }
  }
}

function freezeInputs() {
  $("#minutes-input").attr("disabled", "disabled");
  $("#seconds-input").attr("disabled", "disabled");
}
function unfreezeInputs() {
  $("#minutes-input").removeAttr("disabled");
  $("#seconds-input").removeAttr("disabled");
}
