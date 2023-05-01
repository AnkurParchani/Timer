// Getting all the elements
const pauseBtn = document.querySelector(".pauseButton");
const resetBtn = document.querySelector(".resetButton");
const playBtn = document.querySelector(".playButton");
const settingsContainer = document.querySelector(".settingsContainer");
const startBtn = document.querySelector(".startButton");

// Global functions
let wakeLock = null;
let workLapsArr = [];
let restLapsArr = [];
let count;
let timerInterval;
let workTimeAudio = new Audio("./media/workAlarm.mp4");
let restTimeAudio = new Audio("./media/restAlarm.mp4");

// Preventing screen from sleeping using wakelock
const requestWakeLock = async () => {
  try {
    // Starting wakeLock for the first time
    wakeLock = await navigator.wakeLock.request("screen");

    // Checking if the user has left the page and returned again, then starting wakelock again
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible" && wakeLock.released) {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    });
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

requestWakeLock();

// Creating the FUNCTION
function timerFunction() {
  // Getting all three action inputs
  const totalDuration = document.querySelector("#totalDuration").value;
  const workTime = Number(document.querySelector("#workDuration").value);
  const restTime = Number(document.querySelector("#restDuration").value);

  // Making a loop for workInput and pushing all the value inside workLapsArr
  const workLaps = Math.floor((totalDuration * 60) / (workTime + restTime));
  for (let i = 0; i < workLaps; i++) {
    workLapsArr.push(totalDuration * 60 - (i + 1) * (workTime + restTime));
  }

  // Making restLaps through workLaps
  restLapsArr = workLapsArr.map((workLap) => workLap + restTime);

  // Timer
  timerInterval = setInterval(() => {
    count--;

    const hours = String(Math.floor(count / 60 / 60)).padStart(2, "0"); // Hours
    const minutes = String(Math.floor((count / 60) % 60)).padStart(2, "0"); // Minutes
    const seconds = String(count % 60).padStart(2, "0"); // Remaining Seconds

    const timer = document.querySelector(".timer");

    // Checking if the timer has finished
    if (count < 1) {
      timer.innerHTML = `00:00:00`;
      clearInterval(timerInterval);
      pauseBtn.classList.add("hidden");
      restTimeAudio.play();
    }

    // Checking if the timer has reached work time
    workLapsArr.forEach((lap) => {
      if (count == lap) {
        workTimeAudio.play();
      }
    });

    // Checking if the timer has reached rest time
    restLapsArr.forEach((lap) => {
      if (count == lap) {
        restTimeAudio.play();
      }
    });

    timer.innerHTML = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

startBtn.addEventListener("click", () => {
  const totalDuration = document.querySelector("#totalDuration").value;

  count = totalDuration * 60;

  // Creating the timer HTML
  const hours = String(Math.floor(count / 60 / 60)).padStart(2, "0");
  const minutes = String(Math.floor((count / 60) % 60)).padStart(2, "0"); // Minutes
  const seconds = String(count % 60).padStart(2, "0"); // Remaining Seconds
  const html = `
        <div class="timerContainer">
            <span class="timer">${hours}:${minutes}:${seconds}</span>
        </div>
        `;

  // Removing the inputContainer
  const inputContainer = document.querySelector(".inputContainer");
  inputContainer.classList.add("hidden");

  // Adding the timer inside HTML
  settingsContainer.insertAdjacentHTML("beforeend", html);

  // Initiating the timer
  timerFunction();

  // Removing the start button and showing pause and reset button
  startBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
});

// If user clicks on pause
pauseBtn.addEventListener("click", () => {
  pauseBtn.classList.add("hidden");
  playBtn.classList.remove("hidden");

  clearInterval(timerInterval);
});

// EVENT HANDLERS FOR BUTTONS
// If user clicks on play
playBtn.addEventListener("click", () => {
  pauseBtn.classList.remove("hidden");
  playBtn.classList.add("hidden");

  //Clearing the arrays before executing timerFunction again
  workLapsArr = [];
  restLapsArr = [];

  timerFunction();
});

resetBtn.addEventListener("click", () => {
  // Removing the timer
  const timerContainer = document.querySelector(".timerContainer");
  clearInterval(timerInterval);

  // Clearing the arrays
  workLapsArr = [];
  restLapsArr = [];

  // Removing and adding necessary buttons
  startBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
  playBtn.classList.add("hidden");
  resetBtn.classList.add("hidden");
  timerContainer.remove();

  // Showing inputContainer
  const inputContainer = document.querySelector(".inputContainer");
  inputContainer.classList.remove("hidden");
});
