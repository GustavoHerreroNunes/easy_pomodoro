import webStorage from "./webStorage.js";

window.onload = () => {
    webStorage.defineStorage();

    let { currentCycle, currentTimer } = webStorage.getData("session");

    console.log(`Current Cycle: ${currentCycle}`);
    console.log(`Current Timer: ${currentTimer}`);
}
