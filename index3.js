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

function getStream (type) {
  if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  
  getUserMedia(constraints)
    .then(function (stream) {
      var mediaControl = document.querySelector(type);

      var audioContext = new AudioContext();
      var source = audioContext.createMediaStreamSource(stream);
      var source2 = audioContext.createMediaStreamSource(stream);
      let audioDelay = audioContext.createDelay(10);
      let audioDelay2 = audioContext.createDelay(10);
      let gainNode = audioContext.createGain();
      let gainNode2 = audioContext.createGain();
      let ocillator = audioContext.createOscillator();
      let ocillator2 = audioContext.createOscillator();
    
      audioDelay.delayTime.value = 3;
      audioDelay2.delayTime.value = 2;
      
      
      source.connect(audioDelay).connect(gainNode).connect(audioContext.destination);
      //source2.connect(audioDelay2).connect(gainNode).connect(ocillator).connect(audioContext.destination);
      console.log(audioDelay)
      console.log(audioContext)
      console.log(source)
      console.log(stream)
      console.log(audioContext.destination)
      
      //if ('srcObject' in mediaControl) {
      //  mediaControl.srcObject = stream;
      //} else if (navigator.mozGetUserMedia) {
      //  mediaControl.mozSrcObject = stream;
      //} else {
      //  mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      //}
      
      mediaControl.play();
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
}
