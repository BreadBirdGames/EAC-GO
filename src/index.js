// This should only be used for characters, keep scene sprites in another system
const thumbnails = {
  HNAndersen: "assets/Kaptajn.png",
  Sailor: "assets/Matros.jpg",
  "End Game": "",
};

const characters = {
  Person0: "HNAndersen",
  Person1: "Sailor",
  "127.0.0.1/": "HNAndersen",
  "https://breadbirdgames.github.io/uqw-hnandersen/": "HNAndersen",
  "https://asia-house.dk/uqw-hnandersen/": "HNAndersen"
};

window.conversing = false;

const thumbnailImage = document.createElement("img");
thumbnailImage.id = "thumbnail";
document.body.appendChild(thumbnailImage);

function display_thumbnail(str) {
  if (!window.ready) {
    return;
  }

  if (str in thumbnails) {
    thumbnailImage.classList.remove("hidden");
    thumbnailImage.src = thumbnails[str];
  }
}

window.display_thumbnail = display_thumbnail;

const virtRoot = document.createElement("div");

// create QRVideo
const qrVideo = document.createElement("video");
qrVideo.id = "qr-video";

// Import font awesome
const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "font-awesome/css/all.min.css";
document.head.appendChild(fontAwesomeLink);

// Reset button!
const resetButton = document.createElement("button");
resetButton.id = "reset-button";
resetButton.addEventListener("click", function () {
  window.restart();
});
resetButton.innerHTML = "RESET GAME PROGRESS";

const errorResetButton = document.createElement("button");
errorResetButton.id = "error-reset-button";
errorResetButton.addEventListener("click", function () {
  window.restart();
});
errorResetButton.innerHTML = "RESET GAME PROGRESS";

// Object labels!
const currentObjectiveTitle = document.createElement("h1");
currentObjectiveTitle.id = "objective-Title";
currentObjectiveTitle.innerText = "Current objective: ";

window.currentObjective = document.createElement("b");
window.currentObjective.id = "objective-label";
window.currentObjective.innerText = "objective.";

const notifcationSound = new Audio("assets/NotificationSound.wav");

window.updateObjective = function (newObjective) {
  window.currentObjective.innerText = newObjective;

  notifcationSound.play();
  new Notify({
    status: "info",
    title: "Quest update",
    text: newObjective,
    effect: "fade",
    speed: 300,
    customClass: "",
    customIcon: "",
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    notificationsGap: null,
    notificationsPadding: null,
    type: "outline",
    position: "center",
    customWrapper: "",
  });
};

const tabL = document.createElement("div");
tabL.id = "left-tab";
tabL.classList.add("tabs");
tabL.appendChild(resetButton);
tabL.appendChild(currentObjectiveTitle);
tabL.appendChild(window.currentObjective);

const tabR = document.createElement("div");
tabR.id = "right-tab";
tabR.classList.add("tabs");
tabR.appendChild(qrVideo);

// Create bottom nav bar
const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";

const logButton = document.createElement("button");
logButton.id = "log-button";
logButton.innerHTML = '<i class="fa-solid fa-scroll"></i>';
// Log button click
function logClick() {
  if (!window.ready) {
    return;
  }

  if (virtRoot.classList.contains("current-is-right")) {
    virtRoot.classList.remove("current-is-right");
    virtRoot.classList.add("current-is-left");
  }
}
logButton.addEventListener("click", logClick);
buttonContainer.appendChild(logButton);

const cameraButton = document.createElement("button");
cameraButton.id = "camera-button";
cameraButton.innerHTML = '<i class="fa-solid fa-camera-retro"></i>';
// Camera button click
function cameraClick() {
  if (!window.ready) {
    return;
  }

  if (virtRoot.classList.contains("current-is-left")) {
    virtRoot.classList.remove("current-is-left");
    virtRoot.classList.add("current-is-right");
  }
}
cameraButton.addEventListener("click", cameraClick);
buttonContainer.appendChild(cameraButton);

virtRoot.appendChild(buttonContainer);
virtRoot.appendChild(tabL);
virtRoot.appendChild(tabR);

virtRoot.classList.add("current-is-right");

document.body.appendChild(virtRoot);

// ####### Web Cam Scanning #######

import QrScanner from "./qr-scanner.min.js";

// Function for setting result
function setResult(result) {
  if (!window.ready) {
    return;
  }

  if (characters[result.data] != undefined) {
    window.conversationPlay(characters[result.data]);
  }
}

// initialize QR video;
const scanner = new QrScanner(qrVideo, (result) => setResult(result), {
  onDecodeError: (error) => {},
  highlightScanRegion: true,
  highlightCodeOutline: true,
});

scanner.start();

const dialogueBox = document.getElementById("story");
dialogueBox.style.paddingTop = "1rem";

window.conversationPlay = function (passageName) {
  if (window.conversing) {
    return;
  }

  window.Engine.play(passageName);
};

// hide dialogue box if empty
window.conversationStart = function (ev) {
  if (ev == undefined || ev["passage"]["name"] == "End conversation") {
    dialogueBox.classList.add("hidden");
    thumbnailImage.src = "";
    thumbnailImage.classList.add("hidden");
    window.conversing = false;
  } else {
    dialogueBox.classList.remove("hidden");
    thumbnailImage.classList.remove("hidden");
    window.conversing = true;

    if (thumbnails[ev["passage"]["name"]] != undefined) {
      window.display_thumbnail(ev["passage"]["name"]);
    }
  }

  var errorViews = document.getElementsByClassName("error-view");
  if (errorViews.length > 0) {
    errorViews[0].appendChild(errorResetButton);
  }
};
