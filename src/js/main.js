// Get references to key DOM elements (renamed)
const workDurationInputElemOne = document.querySelector(".work-duration-input-one");
const workDurationInputElemParent = document.querySelector(".work-duration-input-parent");
const restDurationInputElem = document.getElementById("rest-duration-input");
const timerValueElement = document.getElementById("timer-value"); // Reference to the new timer display div
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
// Removed: completedSessionsElement, settings buttons

//Audio btn
const asmr_btn = document.getElementById("asmr-btn");
const asmr_audio = document.getElementById("asmr-audio");

const lofi_btn = document.getElementById("lofi-btn");
const lofi_audio = document.getElementById("lofi-audio");

const rain_btn = document.getElementById("rain-btn");
const rain_audio = document.getElementById("rain-audio");

const classical_music_btn = document.getElementById("classical-music-btn");
const classical_audio = document.getElementById("classical-audio");
//Audio btn


//audio btn states
let currentASMRBtnState=null;
let currentLofiBtnState=null;
let currentRainBtnState=null;
let currentClassicalMBtnState=null;

const lofi_playing_sound = document.querySelector(".lofi-playing-sound");
const lofi_sound_paused = document.querySelector(".lofi-sound-paused");

const asmr_playing_sound = document.querySelector(".asmr-playing-sound");
const asmr_sound_paused = document.querySelector(".asmr-sound-paused");

const rain_playing_sound = document.querySelector(".rain-playing-sound");
const rain_sound_paused = document.querySelector(".rain-sound-paused");

const classicalM_playing_sound = document.querySelector(".classicalM-playing-sound");
const classicalM_sound_paused = document.querySelector(".classicalM-sound-paused");
//audio btn states


//vol-ctrl btns
const lofi_volume_control = document.getElementById("lofi-volume-control")
const asmr_volume_control = document.getElementById("asmr-volume-control")
const rain_volume_control = document.getElementById("rain-volume-control")
const classicalm_volume_control = document.getElementById("classicalm-volume-control")
//vol-ctrl btns

const quote_text = document.getElementById("quote-text");
const quotes_endpoint = "https://quotes-api-self.vercel.app/quote";


const bodyElement = document.body; // Reference to the body element for adding/removing classes
const circleProgress = document.querySelector(".circle-progress"); // Reference to the SVG circle progress element
const loadingOverlay = document.getElementById('loading-overlay'); // Reference to the loading overlay

// Timer variables (renamed)
let workDurationSeconds = parseInt(workDurationInputElemOne.textContent) * 60; // Convert minutes to seconds
let restDurationSeconds = parseInt(restDurationInputElem.value) * 60; // Convert minutes to seconds
let remainingTimeSeconds = workDurationSeconds; // Current time remaining, starts with work duration
let isTimerPaused = true; // Flag to track if the timer is paused (renamed)
let isWorkSessionActive = true; // Flag to track if the current session is a work session (renamed)
let timerIntervalId = null; // To store the interval ID for the timer (renamed)
// Removed: completedSessions variable

// --- Utility Functions (renamed where applicable) ---

// Format time from seconds into MM:SS
function formatTimeDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update the SVG circle progress and the new time display
function updateTimerDisplay() {
    const radius = 45; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Calculate circumference

    const totalSessionDuration = isWorkSessionActive ? workDurationSeconds : restDurationSeconds; // Get total duration for current session type
    // Prevent division by zero if duration is 0 (should be caught by input validation, but good practice)
    const dashOffset = totalSessionDuration > 0 ? circumference * remainingTimeSeconds / totalSessionDuration : circumference;

    // Apply the offset to the circle's stroke-dashoffset property
    circleProgress.style.strokeDashoffset = dashOffset;

    // This is where the code to update the timer countdown display was previously located (inside the SVG).
    // It has been replaced with the line below to update the new div element.
    timerValueElement.textContent = formatTimeDisplay(remainingTimeSeconds);
}

// --- Core Timer Logic ---

// Function to update the timer every second
function runTimerTick() { // Renamed function
    if (!isTimerPaused) {
        remainingTimeSeconds--; // Decrement time

        // Update browser tab title
        document.title = `${formatTimeDisplay(remainingTimeSeconds)} - Pomodoro Timer`; // Set tab title to current time

        if (remainingTimeSeconds <= 0) {
            // Timer finished, switch session type
            isWorkSessionActive = !isWorkSessionActive;
            remainingTimeSeconds = isWorkSessionActive ? workDurationSeconds : restDurationSeconds; // Set time for the new session type

            // Removed sound playing logic

            // Update body classes based on the new session state
            if (!isWorkSessionActive) { // If just switched to rest mode
                bodyElement.classList.add('rest-session-active'); // Use renamed class
            } else { // If just switched to work mode (from rest)
                bodyElement.classList.remove('rest-session-active'); // Remove rest mode styles
            }

            isTimerPaused = true; // Pause the timer automatically after a session ends

            // Add timer-paused class when session ends and pauses
            bodyElement.classList.add('timer-paused');
            // Remove timer-running class
            bodyElement.classList.remove('timer-running');


            // Clear the interval so it doesn't continue running while paused
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }

        // Always update the progress display while timer is running
        updateTimerDisplay();
    }
}

// --- Event Listeners (renamed where applicable) ---

// Start button click handler
startButton.addEventListener("click", () => {
    isTimerPaused = false; // Unpause the timer

    bodyElement.classList.add('timer-running'); // Add class for running state styles
    bodyElement.classList.remove('timer-paused'); // Remove paused state styles

    if (!isWorkSessionActive) {
        bodyElement.classList.add('rest-session-active'); // Add rest mode style if starting rest
    } else {
         bodyElement.classList.remove('rest-session-active'); // Ensure rest mode is off if starting work
    }


    // Start the interval only if it's not already running
    if (timerIntervalId === null) {
        timerIntervalId = setInterval(runTimerTick, 1000); // Call runTimerTick every 1000ms (1 second)
    }
});

// Pause button click handler
pauseButton.addEventListener("click", () => {
    isTimerPaused = true; // Pause the timer

    bodyElement.classList.remove('timer-running'); // Remove running state styles
    bodyElement.classList.add('timer-paused'); // Add paused state styles

    // Clear the interval when paused to stop the timer loop
    clearInterval(timerIntervalId);
    timerIntervalId = null; // Reset timerIntervalId
});

//here for chang buttons
// Handle changes to work duration input
workDurationInputElemParent.addEventListener("click", (event) => {
    event.preventDefault();
    if(event.target.tagName==="BUTTON"){
            const newWorkDuration = parseInt(event.target.textContent);
        // Only update if the value is a valid number greater than 0
        if (!isNaN(newWorkDuration) && newWorkDuration > 0) {
            workDurationSeconds = newWorkDuration * 60; // Update work duration in seconds
            // If currently in a work session and paused, update remaining time and display immediately
            if (isWorkSessionActive && isTimerPaused) {
                remainingTimeSeconds = workDurationSeconds;
                updateTimerDisplay();
            } else if (isWorkSessionActive && timerIntervalId !== null) {
                // If running a work session, restart timer with new duration
                remainingTimeSeconds = workDurationSeconds;
                updateTimerDisplay(); // Update display immediately
                clearInterval(timerIntervalId);
                timerIntervalId = setInterval(runTimerTick, 1000);
            }
        } else {
            console.warn("Invalid work duration. Please enter a number greater than 0.");
            event.target.textContent = workDurationSeconds / 60; // Reset input to current valid value
        }

        //handle rest
        const newRestDuration = parseInt(event.target.textContent)/5;

        // Only update if the value is a valid number greater than 0
        if (!isNaN(newRestDuration) && newRestDuration > 0) {
            restDurationSeconds = newRestDuration * 60; // Update rest duration in seconds
            // If currently in a rest session and paused, update remaining time and display immediately
            if (!isWorkSessionActive && isTimerPaused) {
                remainingTimeSeconds = restDurationSeconds;
                updateTimerDisplay();
            } else if (!isWorkSessionActive && timerIntervalId !== null) {
                // If running a rest session, restart timer with new duration
                remainingTimeSeconds = restDurationSeconds;
                updateTimerDisplay(); // Update display immediately
                clearInterval(timerIntervalId);
                timerIntervalId = setInterval(runTimerTick, 1000);
            }
        } else {
            console.warn("Invalid rest duration. Please enter a number greater than 0.");
            restDurationInputElem.value = restDurationSeconds / 60; // Reset input to current valid value
        }
        }
});


// Removed settings toggle function and event listeners

// --- Initial Setup ---

// Run updateTimerDisplay on page load to display the initial time (25:00)
updateTimerDisplay();

// Add 'page-loaded' class to the body once the DOM is fully loaded and hide overlay
document.addEventListener('DOMContentLoaded', () => {
    bodyElement.classList.add('page-loaded');
    // Set initial state to paused
    bodyElement.classList.add('timer-paused');
     // Hide the loading overlay after a short delay
    setTimeout(() => {
       loadingOverlay.style.opacity = '0';
       loadingOverlay.style.visibility = 'hidden';
    }, 500); // Adjust delay as needed
});


//play/pause event
asmr_btn.addEventListener("click",()=>{
    currentASMRBtnState = togglePlayPauseState(currentASMRBtnState, asmr_audio,asmr_playing_sound,asmr_sound_paused );
})


lofi_btn.addEventListener("click",()=>{
    currentLofiBtnState = togglePlayPauseState(currentLofiBtnState, lofi_audio,lofi_playing_sound,lofi_sound_paused );
})

rain_btn.addEventListener("click",()=>{
    currentRainBtnState = togglePlayPauseState(currentRainBtnState, rain_audio,rain_playing_sound,rain_sound_paused );
})

classical_music_btn.addEventListener("click",()=>{
    currentClassicalMBtnState = togglePlayPauseState(currentClassicalMBtnState, classical_audio,classicalM_playing_sound,classicalM_sound_paused);
})


const togglePlayPauseState = (currentBtnState, audio, sound_playing, sound_paused)=>{
    if(!currentBtnState){
        audio.play();
        currentBtnState=true;
        sound_playing.classList.add("play-state");
        sound_paused.classList.remove("pause-state");
    }else{
        audio.pause();
        currentBtnState=null;
        sound_playing.classList.remove("play-state");
        sound_paused.classList.add("pause-state");
    }
        return currentBtnState;
}
//play/pause event

//vol ctrl
lofi_volume_control.addEventListener("input", ()=>{
    lofi_audio.volume = lofi_volume_control.value
})

asmr_volume_control.addEventListener("input", ()=>{
    asmr_audio.volume = asmr_volume_control.value
})

rain_volume_control.addEventListener("input", ()=>{
    rain_audio.volume = rain_volume_control.value
})

classicalm_volume_control.addEventListener("input", ()=>{
    classical_audio.volume = classicalm_volume_control.value
})
//vol ctrl

const fetchData= async(url)=>{
    try{
        const req = await fetch(url);
        const res = await req.json();
        return res
    }catch(err){
        console.error("Err",err);
        throw new Error("Error", err)
    }
}

fetchData(quotes_endpoint)
    .then(data=>{
        quote_text.textContent=data.quote
    })
    .catch(err=>console.log(err))