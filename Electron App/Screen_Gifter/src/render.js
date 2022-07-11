const { Menu, dialog } = require('electron');
const { writeFile } = require("fs");

let startButton = document.getElementById("startCapture");
let stopButton = document.getElementById("stopCapture");
let saveButton = document.getElementById("save");
let clearButton = document.getElementById("clear");
let videoSelectBtn = document.getElementById("videoSelectBtn");

videoSelectBtn.onclick = getVideoSources;

let videoWindow = document.getElementById("video");
let mediaRecorder;
const recordedChunks = [];

startButton.onclick = () => {
  if (startButton.innerText === "Capture") {
    recordedChunks.length = 0;
    saveButton.disabled = true;
    mediaRecorder.start();
    startButton.innerText = "Stop";
    startButton.style.backgroundColor = "red";
  } else {
    mediaRecorder.stop();
    startButton.innerText = "Capture";
    saveButton.disabled = false;
    startButton.style.backgroundColor = "green";
  }
};

saveButton.onclick = () => {
  handleSave();
};

async function getVideoSources() {
  const  {desktopCapturer,remote}  = require("electron");




  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map((source) => {
      return {
        label: source.name,
        click: () => selectSource(source),
      };
    })
  );

  videoOptionsMenu.popup();
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;
  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };
  startButton.disabled = false;

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  videoWindow.srcObject = stream;
  videoWindow.play();

  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  function handleDataAvailable(e) {
    console.log("video data available");
    recordedChunks.push(e.data);
  }

  // handleStop
  async function handleStop(e) {
    console.log("video recording stopped");
    saveButton.disabled = false;
    videoWindow.controls = true;
  }
}
//tops the recording

async function handleSave(e) {
  saveButton.disabled = true;
  const blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save video",

    defaultPath: `vid-${Date.now()}.webm`,
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log("video saved successfully!"));
  }
}
