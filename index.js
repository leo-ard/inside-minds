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
      let audioDelay = audioContext.createDelay(10);
      let gainNode = audioContext.createGain();
      let convolver = audioContext.createConvolver();
        // Nice website for impulses : https://impulses.prasadt.com/
      let buffer = await fetch("./space2.wav").then(response => response.arrayBuffer()).then(buffer => audioContext.decodeAudioData(buffer))
      convolver.buffer = buffer

      gainNode.gain.value = 1;
      volume = (v) => gainNode.gain.value=v;
     
    
      audioDelay.delayTime.value = 3;
      //audioDelay2.delayTime.value = 2;
      
      
      source.connect(audioDelay).connect(convolver).connect(gainNode).connect(audioContext.destination);
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
