function getUserMedia(constraints) {
  // if Promise-based API is available, use it
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
    
  // otherwise try falling back to old, possibly prefixed API...
  var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
  if (legacyApi) {
    // ...and promisify it
    return new Promise(function (resolve, reject) {
      legacyApi.bind(navigator)(constraints, resolve, reject);
    });
  }
}

volume=null

function getStream (type) {
  if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  
  getUserMedia(constraints)
    .then(async function (stream) {
        
      var mediaControl = document.querySelector(type);

      var audioContext = new AudioContext();
      var source = audioContext.createMediaStreamSource(stream);
      let audioDelay1 = audioContext.createDelay(10);
      let audioDelay2 = audioContext.createDelay(10);
      let gainNode1 = audioContext.createGain();
      let gainNode2 = audioContext.createGain();
      let convolver = audioContext.createConvolver();
        // Nice website for impulses : https://impulses.prasadt.com/
      let buffer = await fetch("./singularity.wav").then(response => response.arrayBuffer()).then(buffer => audioContext.decodeAudioData(buffer))
      convolver.buffer = buffer

      gainNode1.gain.value = 1;
      gainNode2.gain.value = 0.5;
      volume = (v) => {console.log(v/2);gainNode1.gain.value=v; gainNode2.gain.value=v/2}
    
      audioDelay1.delayTime.value = 3;
      audioDelay2.delayTime.value = 1.5;
      //audioDelay2.delayTime.value = 2;
      
      
      source.connect(audioDelay1).connect(convolver).connect(gainNode1).connect(audioContext.destination);
      source.connect(audioDelay2).connect(convolver).connect(gainNode2).connect(audioContext.destination);
      //source2.connect(audioDelay2).connect(gainNode).connect(ocillator).connect(audioContext.destination);
      
      //if ('srcObject' in mediaControl) {
      //  mediaControl.srcObject = stream;
      //} else if (navigator.mozGetUserMedia) {
      //  mediaControl.mozSrcObject = stream;
      //} else {
      //  mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      //}
      
      //mediaControl.play();
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
}
