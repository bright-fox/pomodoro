(() => {
    // cache DOM elements
    const startScreen = document.querySelector(".start");
    const counterScreen = document.querySelector(".counter");

    const mainFunctions = MainFunctions(startScreen, counterScreen);
    mainFunctions.init();
})()

function MainFunctions(startScreen, counterScreen) {
    const addStartButtonListener = _ => {
        const startButton = document.querySelector(".start-button");
        startButton.addEventListener("click", _ => {
            startScreen.classList.add("hidden");
            counterScreen.classList.remove("hidden");
        });
    }

    const init = _ => {
        addStartButtonListener();
    }

    return { init };
}