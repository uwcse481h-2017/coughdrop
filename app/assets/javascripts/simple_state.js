window.load_state = window.load_state || {};
window.load_state.state = "js_retrieved";
window.load_state.js_retrieved = true;
navigator.trueGetUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozillaGetUserMedia;