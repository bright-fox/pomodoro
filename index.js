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
    let studyTimer;
    let breakTimer;
    const studyTime = "25:00";
    const breakTime = "05:00";
    const finishedTime = "00:00";

    const addStartButtonListener = _ => {
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _ => initStudy());
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
        breakClock.textContent = breakTime;
        counterScreen.classList.add("hidden");
        breakScreen.classList.remove("hidden");
        breakTimer = setInterval(function () { updateTimer(breakClock, false) }, 1000);
    }

    const initStudy = _ => {
        counterClock.textContent = studyTime;
        startScreen.classList.add("hidden");
        breakScreen.classList.add("hidden");
        counterScreen.classList.remove("hidden");
        counterClock.style.width = counterClock.offsetWidth;
        studyTimer = setInterval(function () { updateTimer(counterClock, true); }, 1000);
    }

    const padNum = num => ("0" + num).substr(-2);

    const init = _ => {
        addStartButtonListener();


    }

    return { init };
}