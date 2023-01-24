const defineStorage = () => {
    if(!localStorage.numberOfCycles){
        localStorage.numberOfCycles = 5;
    }
    if(!sessionStorage.currentCycle || !sessionStorage.currentTimer || 
    !sessionStorage.pomodorosPlayed || !sessionStorage.timerStatus || 
    !sessionStorage.delayTime){
        sessionStorage.currentCycle = 1;
        sessionStorage.currentTimer = "Pomodoro";
        sessionStorage.pomodorosPlayed = 0;
        sessionStorage.timerStatus = "Não iniciado";
        sessionStorage.delayTime = 0;
    }
}

const getNumberOfCycles = () => {
    return localStorage.numberOfCycles
}

const setNumberOfCycles = (numberOfCycles) => {
    localStorage.numberOfCycles = numberOfCycles;
}

const getCurrentTimer = () => {
    return sessionStorage.currentTimer;
}

const setCurrentTimer = (currentTimer) => {
    sessionStorage.currentTimer = currentTimer;
}

const getCurrentCycle = () => {
    return sessionStorage.currentCycle;
}

const setCurrentCycle = (currentCycle) => {
    sessionStorage.currentCycle = currentCycle;
}

const getPomodorosPlayed = () => {
    return sessionStorage.pomodorosPlayed;
}

const setPomodorosPlayed = (pomodorosPlayed) => {
    sessionStorage.pomodorosPlayed = pomodorosPlayed;
}

const getTimerStatus = () => {
    return sessionStorage.timerStatus;
}

const setTimerStatus = (timerStatus) => {
    sessionStorage.timerStatus = timerStatus;
}

const getDelayTime = () => {
    return sessionStorage.delayTime;
}

const setDelayTime = (delayTime) => {
    sessionStorage.delayTime = delayTime;
}

const webStorage = { defineStorage, 
                    getNumberOfCycles, 
                    setNumberOfCycles, 
                    getCurrentTimer, 
                    setCurrentTimer, 
                    getCurrentCycle, 
                    setCurrentCycle, 
                    getTimerStatus, 
                    setTimerStatus, 
                    getPomodorosPlayed,
                    setPomodorosPlayed,
                    getDelayTime,
                    setDelayTime };

export default webStorage;
