(() => {
    // cache DOM elements
    const startScreen = document.querySelector(".start");
    const counterScreen = document.querySelector(".counter");
    const studyClock = document.querySelector(".counter-clock");
    const breakScreen = document.querySelector(".break");
    const breakClock = document.querySelector(".break-clock");

    const mainFunctions = MainFunctions(startScreen, counterScreen, studyClock, breakScreen, breakClock);
    mainFunctions.init();
})()

function MainFunctions(startScreen, counterScreen, studyClock, breakScreen, breakClock) {
    // sounds variables
    let gongSound;
    let isMuted = false;

    // timer variables
    let studyTimer;
    let breakTimer;
    const studyTime = "25:00";
    const breakTime = "05:00";
    const finishedTime = "00:00";

    let isPause = false;
    let isStudy = false;

    const addStartButtonListener = _ => {
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _ => {
            // display play and skip button
            const playButton = document.querySelector("#play");
            const skipButton = document.querySelector("#skip");
            playButton.classList.remove("hidden");
            skipButton.classList.remove("hidden");
            initStudy();
        });
    }

    const addMuteButtonListener = _ => {
        const muteButton = document.querySelector("#mute");
        muteButton.addEventListener("click", _ => {
            isMuted = !isMuted;
            if (isMuted) gongSound.pause();
            muteButton.innerHTML = isMuted ? "<i class='fas fa-volume-mute'></i>" : "<i class='fas fa-volume-up'></i>";
            muteButton.setAttribute("title", isMuted ? "Unmute" : "Mute");
        })
    }

    const addPlayButtonListener = _ => {
        const playButton = document.querySelector("#play");
        playButton.addEventListener("click", _ => {
            isPause = !isPause;
            if (isPause) {
                playButton.innerHTML = "<i class='fas fa-pause'></i>";
                playButton.setAttribute("title", "Play");
                clearInterval(isStudy ? studyTimer : breakTimer);
            } else {
                playButton.innerHTML = "<i class='fas fa-play'></i>";
                playButton.setAttribute("title", "Pause");
                if (isStudy) {
                    studyTimer = setInterval(function () { updateTimer(studyClock) }, 1000);
                } else {
                    breakTimer = setInterval(function () { updateTimer(breakClock) }, 1000);
                }
            }
        })
    }

    const addSkipButtonListener = _ => {
        const skipButton = document.querySelector("#skip");
        const playButton = document.querySelector("#play");

        skipButton.addEventListener("click", _ => {
            // clear timer and reset play button
            clearInterval(isStudy ? studyTimer : breakTimer);
            isPause = false;
            playButton.innerHTML = "<i class='fas fa-play'></i>";
            isStudy ? initBreak() : initStudy();
        });
    }

    const updateTimer = (clock) => {
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
        isStudy = false;
        playGong();
        breakClock.textContent = breakTime;
        counterScreen.classList.add("hidden");
        breakScreen.classList.remove("hidden");
        breakTimer = setInterval(function () { updateTimer(breakClock) }, 1000);
    }

    const initStudy = _ => {
        isStudy = true;
        playGong();
        studyClock.textContent = studyTime;
        startScreen.classList.add("hidden");
        breakScreen.classList.add("hidden");
        counterScreen.classList.remove("hidden");
        studyTimer = setInterval(function () { updateTimer(studyClock); }, 1000);
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

    const initClickListeners = _ => {
        addStartButtonListener();
        addMuteButtonListener();
        addPlayButtonListener();
        addSkipButtonListener();
    }

    const init = _ => {
        // init gong sound
        initGong();
        initClickListeners();
    }

    return { init };
}