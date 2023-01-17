const defineStorage = () => {
    if(!localStorage.easyPomodoroNumberOfCycles){
        localStorage.easyPomodoroNumberOfCycles = 5;
    }
    if(!sessionStorage.easyPomodoroCurrentCycle || !sessionStorage.easyPomodoroCurrentTimer){
        sessionStorage.easyPomodoroCurrentCycle = 1;
        sessionStorage.easyPomodoroCurrentTimer = 1;
    }
}

const getData = (dataType) => {
    return (dataType === "setting") ? localStorage.easyPomodoroNumberOfCycles :
           (dataType === "session") && { currentCycle: sessionStorage.easyPomodoroCurrentCycle, currentTimer: sessionStorage.easyPomodoroCurrentTimer }
}

const updateDate = (numberOfCycles, currentCycle, currentTimer) => {
    if(numberOfCycles)
        localStorage.easyPomodoroNumberOfCycles = numberOfCycles;
    if(currentCycle && currentTimer){
        sessionStorage.easyPomodoroCurrentCycle = currentCycle;
        sessionStorage.easyPomodoroCurrentTimer = currentTimer;
    }
}

const webStorage = { defineStorage, getData, updateDate };

export default webStorage;
