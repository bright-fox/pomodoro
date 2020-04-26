(() => {
    const mainFunctions = MainFunctions();
    mainFunctions.init();
})()

function MainFunctions() {
    // DOM elements
    let startScreen;
    let counterScreen;
    let studyClock;
    let breakScreen;
    let breakClock;
    let skipButton;
    let playButton;
    let startButton;
    let muteButton;

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
        startButton.addEventListener("click", _ => {
            // display play and skip button
            playButton.classList.remove("hidden");
            skipButton.classList.remove("hidden");
            initStudy();
        });
    }

    const addMuteButtonListener = _ => {
        muteButton.addEventListener("click", _ => {
            isMuted = !isMuted;
            if (isMuted) gongSound.pause();
            muteButton.innerHTML = isMuted ? "<i class='fas fa-volume-mute'></i>" : "<i class='fas fa-volume-up'></i>";
            muteButton.setAttribute("title", isMuted ? "Unmute" : "Mute");
        })
    }

    const addPlayButtonListener = _ => {
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
        skipButton.addEventListener("click", _ => {
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
        reset(false);
        breakClock.textContent = breakTime;
        counterScreen.classList.add("hidden");
        breakScreen.classList.remove("hidden");
        breakTimer = setInterval(function () { updateTimer(breakClock) }, 1000);
    }

    const initStudy = _ => {
        reset(true);
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

    const initGongSound = _ => {
        gongSound = new Audio("./sounds/gong.mp3");
        gongSound.volume = 0.3;
    }

    const reset = (setIsStudy) => {
        clearInterval(isStudy ? studyTimer : breakTimer);
        isPause = false;
        playButton.innerHTML = "<i class='fas fa-play'></i>";
        playGong();
        isStudy = setIsStudy;
    }

    const initClickListeners = _ => {
        addStartButtonListener();
        addMuteButtonListener();
        addPlayButtonListener();
        addSkipButtonListener();
    }

    const cacheDOMElements = _ => {
        startScreen = document.querySelector(".start");
        counterScreen = document.querySelector(".counter");
        studyClock = document.querySelector(".counter-clock");
        breakScreen = document.querySelector(".break");
        breakClock = document.querySelector(".break-clock");
        skipButton = document.querySelector("#skip");
        playButton = document.querySelector("#play");
        startButton = document.querySelector(".start-button");
        muteButton = document.querySelector("#mute");
    }

    const init = _ => {
        cacheDOMElements();
        initGongSound();
        initClickListeners();
    }

    return { init };
}