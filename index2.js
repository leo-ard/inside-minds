let audioContext = new AudioContext();
let stream;
let recorder;
let chunks = []; // Audio

const stopButton = document.getElementById("stop");
const playback = document.getElementById("playback");

stopButton.addEventListener("click", async () => {
    if (recorder && recorder.state === "recording") {
        recorder.stop();
        stopButton.innerText = "Resume Recording";
        return;
    }

    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("dataavailable", event => {
        console.log(event.data);
        chunks.push(event.data);
    });

    recorder.start();

    stopButton.innerText = "Pause Recording";
});

function playDelayedAudio() {
    const source = audioContext.createBufferSource();
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    const fileReader = new FileReader();

    fileReader.onload = function() {
        audioContext.decodeAudioData(fileReader.result, function(decodedData) {
            source.buffer = decodedData;
            source.connect(audioContext.destination);
            const delay = audioContext.createDelay(2);
            delay.connect(audioContext.destination);
            source.connect(delay);
            source.start();
        });
    }

    fileReader.readAsArrayBuffer(audioBlob);
}

setInterval(playDelayedAudio, 2000);
