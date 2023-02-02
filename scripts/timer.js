import webStorage from "./webStorage.js";

const TIMER_NAME = "easyPomodoroTimer";

const initializeTimer = (delayInMinutes) => {
    console.log("Inicializando Timer");

    chrome.alarms.create(TIMER_NAME, {delayInMinutes: delayInMinutes});
}

const stopTimer = () => {
    chrome.alarms.clear(TIMER_NAME);
}

const setNextTimer = () => {
    const currentTimerIndex = parseInt(webStorage.getCurrentTimerIndex());
    const cycleStructure = webStorage.getCycleStructure();

    if(currentTimerIndex + 1 >= cycleStructure.length){
        webStorage.setCurrentTimerIndex(0);
        webStorage.setCurrentTimerName("Pomodoro");
        const currentCycle = parseInt(webStorage.getCurrentCycle());
        const numberOfCycles = parseInt(webStorage.getNumberOfCycles());
        if(currentCycle >= numberOfCycles)
            return false;
        else
            webStorage.setCurrentCycle(currentCycle + 1);
    }else{
        webStorage.setCurrentTimerIndex(currentTimerIndex + 1);
        webStorage.setCurrentTimerName(cycleStructure[currentTimerIndex+1]);
    }
    
    return true;
}

const getEndTime = (onSuccess) => {
    chrome.alarms.get(TIMER_NAME, (alarm) => {
        const endTime = alarm.scheduledTime;
        onSuccess(endTime);
    });
}

const getCurrentDelayTime = (onSuccess) => {
    getEndTime((endTime) => {
        const currentTime = Date.now();
        const delayTime = endTime - currentTime

        onSuccess(delayTime);
    });
}

const timer = { initializeTimer, stopTimer, setNextTimer, getEndTime, getCurrentDelayTime };

export default timer;
