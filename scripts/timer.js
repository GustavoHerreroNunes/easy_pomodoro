const timerData = {
    currentTimerNumber: 0,
    name: "easyPomodoroTimer",
    delayInMinutes: 0,
    startTime: 0,
    endTime: 0
}

const initializeTimer = () => {
    timerData.delayInMinutes = 0.2,
    timerData.startTime = Date.now();

    chrome.alarms.create(timerData.name, {delayInMinutes: timerData.delayInMinutes});
}

const getEndTime = () => {
    chrome.alarms.get(timerData.name, (alarm) => {
        timerData.endTime = alarm.scheduledTime;
        console.log("End Time gotten");
    });
}

const getCurrentDelayTime = () => {
    return timerData.endTime - timerData.startTime;
}

const timer = { initializeTimer, getEndTime, getCurrentDelayTime };

export default timer;
