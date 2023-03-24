let audioContext = new AudioContext();
let stream;
let recorder;

const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const playback = document.getElementById("playback");

let DELAY = 2000;

let chunks = [];
let currentChunk = false;

recordButton.addEventListener("click", async () => {
    chunks = [];
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    
    recorder.addEventListener("dataavailable", event => {
        console.log(event.data);
        //chunks.push(event.data);
        currentChunk = event.data;

        let audioBlob = new Blob([currentChunk], { type: "audio/ogg; codecs=opus" });
        let audioUrl = URL.createObjectURL(audioBlob);
        let audio = new Audio(audioUrl);
        audio.play();

    });
    
    recorder.start(DELAY);
    
    recordButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener("click", () => {
    
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    
    recordButton.disabled = false;
    stopButton.disabled = true;
});

//function delayPlayback() {
//    const source = audioContext.createBufferSource();
//    source.buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1, audioContext.sampleRate);
//    source.buffer.getChannelData(0).fill(0);
//    
//    const delay = audioContext.createDelay(1);
//    delay.delayTime.value = 0.5; // Change this value to adjust the delay time
//    
//    source.connect(delay);
//    delay.connect(audioContext.destination);
//    
//    source.start();
//}

//playback.addEventListener("play", delayPlayback);
