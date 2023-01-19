const defineStorage = () => {
    if(!localStorage.numberOfCycles){
        localStorage.numberOfCycles = 5;
    }
    if(!sessionStorage.currentCycle || !sessionStorage.currentTimer || !sessionStorage.pomodorosPlayed){
        sessionStorage.currentCycle = 1;
        sessionStorage.currentTimer = "Pomodoro";
        sessionStorage.pomodorosPlayed = 0;
    }
}

const getDada = (dadaType) => {
    return (dadaType === "setting") ? localStorage.numberOfCycles :
           (dadaType === "session") && {
             currentCycle: sessionStorage.currentCycle, 
             currentTimer: sessionStorage.currentTimer,
             pomodorosPlayed: sessionStorage.pomodorosPlayed
            }
}

const setNumberOfCycles = (numberOfCycles) => {
    localStorage.numberOfCycles = numberOfCycles;
}

const setCurrentTimer = (currentTimer) => {
    sessionStorage.currentTimer = currentTimer;
}

const setCurrentCycle = (currentCycle) => {
    sessionStorage.currentCycle = currentCycle;
}

const setPomodorosPlayed = (pomodorosPlayed) => {
    sessionStorage.pomodorosPlayed = pomodorosPlayed;
}

const webStorage = { defineStorage,
                    getDada, 
                    setNumberOfCycles, 
                    setCurrentTimer, 
                    setCurrentCycle, 
                    setPomodorosPlayed };

export default webStorage;
