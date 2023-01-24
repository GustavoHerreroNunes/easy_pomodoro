const TIMER_NAME = "easyPomodoroTimer";

const initializeTimer = (delayInMinutes) => {
    console.log("Inicializando Timer");

    chrome.alarms.create(TIMER_NAME, {delayInMinutes: delayInMinutes});
}

const stopTimer = () => {
    chrome.alarms.clear(TIMER_NAME);
}

const getEndTime = (onSuccess) => {
    chrome.alarms.get(TIMER_NAME, (alarm) => {
        const endTime = alarm.scheduledTime;
        console.log("End Time gotten");
        onSuccess(endTime);
    });
}

const getCurrentDelayTime = (onSuccess) => {
    getEndTime((endTime) => {
        const currentTime = Date.now();
        const delayTime = endTime - currentTime
        console.log(`Delay Time: ${delayTime}`);

        onSuccess(delayTime);
    });
}

const timer = { initializeTimer, stopTimer, getEndTime, getCurrentDelayTime };

export default timer;
