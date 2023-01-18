import webStorage from "./webStorage.js";
import timer from "./timer.js";

window.onload = () => {
    webStorage.defineStorage();
    timer.initializeTimer();

    let { currentCycle, currentTimer } = webStorage.getData("session");

    console.log(`Current Cycle: ${currentCycle}`);
    console.log(`Current Timer: ${currentTimer}`);
}
