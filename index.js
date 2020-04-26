(() => {
    // cache DOM elements
    const startScreen = document.querySelector(".start");
    const counterScreen = document.querySelector(".counter");
    const counterClock = document.querySelector(".counter-clock");
    const breakScreen = document.querySelector(".break");
    const breakClock = document.querySelector(".break-clock");

    const mainFunctions = MainFunctions(startScreen, counterScreen, counterClock, breakScreen, breakClock);
    mainFunctions.init();
})()

function MainFunctions(startScreen, counterScreen, counterClock, breakScreen, breakClock) {
    // sounds variables
    let gongSound;
    let isMuted = false;

    // timer variables
    let studyTimer;
    let breakTimer;
    const studyTime = "25:00";
    const breakTime = "05:00";
    const finishedTime = "00:00";

    const addStartButtonListener = _ => {
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _ => initStudy());
    }

    const addMuteButtonListener = _ => {
        const muteButton = document.querySelector("#mute");
        muteButton.addEventListener("click", _ => {
            isMuted = !isMuted;
            muteButton.innerHTML = isMuted ? "<i class='fas fa-volume-mute'></i>" : "<i class='fas fa-volume-up'></i>";
            muteButton.setAttribute("title", isMuted ? "Unmute" : "Mute");
        })
    }

    const updateTimer = (clock, isStudy) => {
        let [minText, secText] = clock.textContent.split(":");
        let min = Number(minText);
        let sec = Number(secText);

        // update the time
        if (sec === 0) {
            min--;
            sec = 59;
        } else {
            sec--;
        }

        // render time
        clock.textContent = `${padNum(min)}:${padNum(sec)}`;
        // check if it is finished
        if (clock.textContent === finishedTime) {
            clearInterval(isStudy ? studyTimer : breakTimer);
            isStudy ? initBreak() : initStudy();
        };
    }

    const initBreak = _ => {
        playGong();
        breakClock.textContent = breakTime;
        counterScreen.classList.add("hidden");
        breakScreen.classList.remove("hidden");
        breakTimer = setInterval(function () { updateTimer(breakClock, false) }, 1000);
    }

    const initStudy = _ => {
        playGong();
        counterClock.textContent = studyTime;
        startScreen.classList.add("hidden");
        breakScreen.classList.add("hidden");
        counterScreen.classList.remove("hidden");
        counterClock.style.width = counterClock.offsetWidth;
        studyTimer = setInterval(function () { updateTimer(counterClock, true); }, 1000);
    }

    const padNum = num => ("0" + num).substr(-2);

    const playGong = _ => {
        if (isMuted) return;
        gongSound.play();
    }

    const initGong = _ => {
        gongSound = new Audio("./sounds/gong.mp3");
        gongSound.volume = 0.3;
    }

    const init = _ => {
        // init gong sound
        initGong();
        addStartButtonListener();
        addMuteButtonListener();
    }

    return { init };
}