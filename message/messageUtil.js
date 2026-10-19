// https://anwaarulislaam.medium.com/build-a-voice-recorder-app-using-only-javascript-and-html-212114a468ca

// JavaScript for the page
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const recordingsList = document.getElementById('recordings-list');

let mediaRecorder;
let audioChunks = [];

// Helper function to add a new recording to the page
function addRecording(blob) {
    // Create a new audio element
    const audio = document.createElement('audio');
    // Set its source to the recorded blob
    audio.src = URL.createObjectURL(blob);
    audio.controls = true;
    // Add it to the page
    recordingsList.appendChild(audio);
}

// Function to handle the "start recording" button click
function startRecording() {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Create a new MediaRecorder instance to record the audio
        mediaRecorder = new MediaRecorder(stream);
        // Add an event listener to be notified when a new chunk of audio is available
        mediaRecorder.addEventListener('dataavailable', event => {
            // Push the new chunk of audio to the array
            audioChunks.push(event.data);
        });
        // Add an event listener to be notified when the recording is finished
        mediaRecorder.addEventListener('stop', () => {
            // Create a new blob from the recorded audio
            const audioBlob = new Blob(audioChunks);
            // Add the recorded audio to the page
            addRecording(audioBlob);
        });
        // Start recording the audio
        mediaRecorder.start();
        // Update the UI
        startButton.disabled = true;
        stopButton.disabled = false;
    })
    .catch(error => {
        // Handle any errors that occurred
        console.error(error);
    });
}

// Function to handle the "stop recording" button click
function stopRecording() {
    // Stop the media recorder
    mediaRecorder.stop();
    // Update the UI
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Add event listeners for the start and stop buttons
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
