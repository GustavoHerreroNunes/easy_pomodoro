import webStorage from "./webStorage.js";
import timer from "./timer.js";
import indexedDBController from "./indexedDB.js";

const initializeElements = () => {
    const timerStatus = document.querySelector("#status");
    const timerDisplay = document.querySelector("#timerDisplay").querySelector("h2");
    const cycleButtons = {
        container: document.querySelector("#cycleButtons"),
        btnStart: document.querySelector("#btnStart"),
        btnJump: document.querySelector("#btnJump"),
    }
    const timerButtons = {
        container: document.querySelector("#timerButtons"),
        btnPlay: document.querySelector("#btnPlay"),
        btnPause: document.querySelector("#btnPause"),
        btnCancel: document.querySelector("#btnCancel")
    }
    const cycleIndicator = {
        cycleTimers: document.querySelector("#cycleTimers"),
        currentTimerIndicator: document.querySelector("#currentTimerIndicator")
    }

    return { timerStatus, timerDisplay, cycleButtons, timerButtons, cycleIndicator }
}

const changeStatus = (newStatus, statusElement, cycleButtons, timerButtons) => {
    webStorage.setTimerStatus(newStatus);

    statusElement.innerHTML = newStatus;
    switch(newStatus){
        case "Iniciado":
            cycleButtons.container.classList.add("hide");
            timerButtons.container.classList.remove("hide");
            timerButtons.btnPlay.classList.add("hide");
            timerButtons.btnPause.classList.remove("hide");
            break;
        case "Pausado":
            timerButtons.btnPlay.classList.remove("hide");
            timerButtons.btnPause.classList.add("hide");
            break;
        case "Cancelado":
        case "Finalizado":
            cycleButtons.container.classList.remove("hide");
            timerButtons.container.classList.add("hide");
            break;
    }
}

const updateTimer = (timerDisplay) => {
    timer.getCurrentDelayTime((delayTime) => {
        timerDisplay.innerHTML = millisToMinutesAndSeconds(delayTime);
    });
}

const millisToMinutesAndSeconds = (millis) => {
    var minutes = new Date(millis).getMinutes();
    var seconds = new Date(millis).getSeconds();
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const secondsToMinutes = (seconds) =>{
    return Math.floor(seconds/60);
}

const minutesAndSecondsToMinute = (minutesAndSeconds) => {
    const [ strMinutes, strSeconds ] = minutesAndSeconds.split(":");
    const numberSeconds = parseInt(strSeconds);
    let numberMinutes = parseInt(strMinutes);

    numberMinutes += secondsToMinutes(numberSeconds);

    return numberMinutes;
}

const setTimerDisplay = (db, timerDisplay) => {
    const currentTimer = webStorage.getCurrentTimer();
    indexedDBController.getRegistry(db, currentTimer, (registry) => {
        const time = registry.time;

        timerDisplay.innerHTML = time;
    })
}

const startTimer = (db, timerStatus, timerDisplay, cycleButtons, timerButtons) => {
    const currentTimer = webStorage.getCurrentTimer();
    
    indexedDBController.getRegistry(db, currentTimer, (timerRegistry) => {
        const delayInMinutes = timerRegistry.time;
        console.log(`[delayInMinutes]: ${delayInMinutes}`);

        timer.initializeTimer(minutesAndSecondsToMinute(delayInMinutes));
       
        changeStatus("Iniciado", timerStatus, cycleButtons, timerButtons);
    });
    
    const intervelId = setInterval(updateTimer, 1000, timerDisplay);

    return intervelId;
}

const pauseTimer = (intervalId, timerStatus, cycleButtons, timerButtons) => {
    timer.getCurrentDelayTime((delayTime) => {
        timer.stopTimer();

        webStorage.setDelayTime(delayTime);

        clearInterval(intervalId);

        changeStatus("Pausado", timerStatus, cycleButtons, timerButtons);
    })
}

const continueTimer = (timerStatus, cycleButtons, timerButtons, timerDisplay) => {
    const delayTime = parseInt(webStorage.getDelayTime());

    timer.initializeTimer(delayTime);
       
    changeStatus("Iniciado", timerStatus, cycleButtons, timerButtons);

    const intervelId = setInterval(updateTimer, 1000, timerDisplay);

    return intervelId;
}

const cancelTimer = (intervalId, timerStatus, cycleButtons, timerButtons) => {
    timer.stopTimer();
    
    clearInterval(intervalId);

    changeStatus("Cancelado", timerStatus, cycleButtons, timerButtons);
}

window.onload = () => {
    const { timerStatus, 
            timerDisplay, 
            cycleButtons, 
            timerButtons, 
            cycleIndicator } = initializeElements();
    let intervalId = 0;

    webStorage.defineStorage();

    indexedDBController.openDatabase((db) => {
        setTimerDisplay(db, timerDisplay);
        
        cycleButtons.btnStart.addEventListener(
            'click', 
            () => {
                console.log("Click");
                intervalId = startTimer(db, timerStatus, timerDisplay, cycleButtons, timerButtons);
            });
        
        timerButtons.btnPause.addEventListener(
            'click',
            () => {
                pauseTimer(intervalId, timerStatus, cycleButtons, timerButtons);
            }
        );

        timerButtons.btnPlay.addEventListener(
            'click',
            () => {
                intervalId = continueTimer(timerStatus, cycleButtons, timerButtons, timerDisplay);
            }
        )

        timerButtons.btnCancel.addEventListener(
            'click',
            () => {
                console.log("AAAAAAA");
                cancelTimer(intervalId, timerStatus, cycleButtons, timerButtons);
                setTimerDisplay(db, timerDisplay);
        })
        
        const currentTimerStatus = webStorage.getTimerStatus();
        if(currentTimerStatus){}
    });


}
