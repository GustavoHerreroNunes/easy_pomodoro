const defineStorage = () => {
    if(!localStorage.numberOfCycles)localStorage.numberOfCycles = 5;

    if(!localStorage.cycleStructure) 
        localStorage.cycleStructure = ["Pomodoro",
                                        "Pausa Curta",
                                        "Pomodoro",
                                        "Pausa Curta",
                                        "Pomodoro",
                                        "Pausa Longa"];
    
    if(!localStorage.currentCycle) localStorage.currentCycle = 1;

    if(!localStorage.currentTimerIndex) localStorage.currentTimerIndex = 0;

    if(!localStorage.currentTimerName) localStorage.currentTimerName = "Pomodoro";

    if(!localStorage.timerStatus) localStorage.timerStatus = "Não iniciado";

    if(!localStorage.delayTime) localStorage.delayTime = 0;
}

const getNumberOfCycles = () => {
    return localStorage.numberOfCycles
}

const setNumberOfCycles = (numberOfCycles) => {
    localStorage.numberOfCycles = numberOfCycles;
}

const getCycleStructure = () => {
    const cycleStructureArr = localStorage.cycleStructure.split(",");
    return cycleStructureArr;
}

const setCycleStructure = (cycleStructure) => {
    localStorage.cycleStructure = cycleStructure;
}

const getCurrentTimerIndex = () => {
    return localStorage.currentTimerIndex;
}

const setCurrentTimerIndex = (currentTimerIndex) => {
    localStorage.currentTimerIndex = currentTimerIndex;
}

const getCurrentTimerName = () => {
    return localStorage.currentTimerName;
}

const setCurrentTimerName = (currentTimerName) => {
    localStorage.currentTimerName = currentTimerName;
}

const getCurrentCycle = () => {
    return localStorage.currentCycle;
}

const setCurrentCycle = (currentCycle) => {
    localStorage.currentCycle = currentCycle;
}

const getTimerStatus = () => {
    return localStorage.timerStatus;
}

const setTimerStatus = (timerStatus) => {
    localStorage.timerStatus = timerStatus;
}

const getDelayTime = () => {
    return localStorage.delayTime;
}

const setDelayTime = (delayTime) => {
    localStorage.delayTime = delayTime;
}

const resetCurrentSessionData = () => {
    localStorage.currentCycle = 1;
    localStorage.currentTimerIndex = "Pomodoro";
    localStorage.pomodorosPlayed = 0;
    localStorage.timerStatus = "Não iniciado";
    localStorage.delayTime = 0;
}

const webStorage = { defineStorage, 
                    getNumberOfCycles, 
                    setNumberOfCycles, 
                    getCycleStructure, 
                    setCycleStructure, 
                    getCurrentTimerIndex, 
                    setCurrentTimerIndex, 
                    getCurrentTimerName, 
                    setCurrentTimerName,
                    getCurrentCycle, 
                    setCurrentCycle, 
                    getTimerStatus, 
                    setTimerStatus, 
                    getDelayTime,
                    setDelayTime,
                    resetCurrentSessionData };

export default webStorage;
