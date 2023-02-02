import webStorage from "./webStorage.js";
import indexedDBController from "./indexedDB.js";
import timer from "./timer.js";
import cycle from "./cycle.js";

const initializeElements = () => {
    const timerName = document.querySelector("h1");
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
        cycleNumber: document.querySelector("#cycleNumber"),
        cycleTimers: document.querySelector("#cycleTimers"),
        currentTimerIndicator: document.querySelector("#currentTimerIndicator")
    }

    return { timerName, timerStatus, timerDisplay, cycleButtons, timerButtons, cycleIndicator }
}

const changeStatus = (timerStatus, cycleButtons, timerButtons) => {
    const newStatus = webStorage.getTimerStatus();

    timerStatus.innerHTML = newStatus;
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
        case "Não Iniciado":
            cycleButtons.container.classList.remove("hide");
            timerButtons.container.classList.add("hide");
            break;
    }
}

const secondsToMinutes = (seconds) =>{
    return (seconds/60);
}

const millisToSeconds = (millis) =>{
    return Math.floor(millis/1000);
}

const millisToMinutesAndSeconds = (millis) => {
    var minutes = new Date(millis).getMinutes();
    var seconds = new Date(millis).getSeconds();
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const minutesAndSecondsToMinute = (minutesAndSeconds) => {
    const [ strMinutes, strSeconds ] = minutesAndSeconds.split(":");
    const numberSeconds = parseInt(strSeconds);
    let numberMinutes = parseInt(strMinutes);

    numberMinutes += secondsToMinutes(numberSeconds);

    return numberMinutes;
}

const setTimerDisplay = (timerDisplay, newTime) => {
    timerDisplay.innerHTML = newTime;
}

const initializeTimerDisplay = (db, timerDisplay) => {
    const currentTimer = webStorage.getCurrentTimerName();
    console.log(currentTimer);
    indexedDBController.getRegistry(db, currentTimer, (registry) => {
        const time = registry.time;
        setTimerDisplay(timerDisplay, time);
    });
}

const initializePopUpInterface = (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons) => {
    initializeTimerDisplay(db, timerDisplay);
    webStorage.setTimerStatus("Não Iniciado");
    changeStatus(timerStatus, cycleButtons, timerButtons);
    timerName.innerHTML = webStorage.getCurrentTimerName();
}

const updateTimerDisplay = (timerDisplay) => {
    timer.getCurrentDelayTime((delayTime) => {
        setTimerDisplay(timerDisplay, millisToMinutesAndSeconds(delayTime))
    });
}

const startTimer = (db, timerStatus, timerDisplay, cycleButtons, timerButtons) => {
    const currentTimer = webStorage.getCurrentTimerName();
    
    indexedDBController.getRegistry(db, currentTimer, (timerRegistry) => {
        const delayInMinutes = timerRegistry.time;

        timer.initializeTimer(minutesAndSecondsToMinute(delayInMinutes));
    
        webStorage.setTimerStatus("Iniciado");   
        changeStatus(timerStatus, cycleButtons, timerButtons);
    });
    
    const intervelId = setInterval(updateTimerDisplay, 1000, timerDisplay);

    return intervelId;
}

const pauseTimer = (intervalId, timerStatus, cycleButtons, timerButtons) => {
    timer.getCurrentDelayTime((delayTime) => {
        timer.stopTimer();

        webStorage.setDelayTime(delayTime);

        clearInterval(intervalId);

        webStorage.setTimerStatus("Pausado");
        changeStatus(timerStatus, cycleButtons, timerButtons);
    })
}

const continueTimer = (timerStatus, cycleButtons, timerButtons, timerDisplay) => {
    const delayTimeInMills = parseInt(webStorage.getDelayTime());
    const delayTimeInMinutes = secondsToMinutes(millisToSeconds(delayTimeInMills));

    timer.initializeTimer((delayTimeInMinutes >= 1) ? delayTimeInMinutes : 1);
    
    webStorage.setTimerStatus("Iniciado");   
    changeStatus(timerStatus, cycleButtons, timerButtons);

    const intervelId = setInterval(updateTimerDisplay, 1000, timerDisplay);

    return intervelId;
}

const cancelTimer = (intervalId, timerStatus, cycleButtons, timerButtons) => {
    timer.stopTimer();
    
    clearInterval(intervalId);

    webStorage.setTimerStatus("Cancelado");
    changeStatus(timerStatus, cycleButtons, timerButtons);
}

const nextTimer = (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons) => {
    const isNextTimerDefined = timer.setNextTimer();
    if(isNextTimerDefined){
        initializePopUpInterface(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
    }else{
        window.location.href = "finishedCycles.html";
    }
}

const requestAlarmStatus = async (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons) => {
    const response = await chrome.runtime.sendMessage({message: "alarmStatus"});
    if(response.alarmStatus === "PLAYED"){
        nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
    }
    else{
        initializePopUpInterface(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
    }
}

window.onload = () => {
    const { timerName,
            timerStatus, 
            timerDisplay, 
            cycleButtons, 
            timerButtons, 
            cycleIndicator } = initializeElements();

    let intervalId = 0;

    webStorage.defineStorage();
    const currentCycle = webStorage.getCurrentCycle();
    const numberOfCycles = webStorage.getNumberOfCycles();
    if(currentCycle === numberOfCycles){
        window.location.href = "finishedCycles.html";
    }else{
        indexedDBController.openDatabase((db) => {
            requestAlarmStatus(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
    
            indexedDBController.getAllRegistries(db, (timers) => {
                const frequencies = {
                    shortBreak: timers[0].frequency,
                    longBreak: timers[1].frequency
                }
                const cycleStructure = cycle.defineCycleStructure(frequencies);
    
                webStorage.setCycleStructure(cycleStructure);
                cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
    
                cycle.createHTMLCycleTimers(cycleIndicator.cycleTimers, cycleStructure);
                cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
            })
    
            
            cycleButtons.btnStart.addEventListener(
                'click', 
                () => {
                    intervalId = startTimer(db, timerStatus, timerDisplay, cycleButtons, timerButtons);
                });
    
            cycleButtons.btnJump.addEventListener(
                'click',
                () => {
                    nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
                    cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
    
                    cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                    cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
                }
            );
            
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
            );
    
            timerButtons.btnCancel.addEventListener(
                'click',
                () => {
                    cancelTimer(intervalId, timerStatus, cycleButtons, timerButtons);
                    initializeTimerDisplay(db, timerDisplay);
                }
            );
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    if(request.onAlarm){
                        clearInterval(intervalId);
                        nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons);
                        cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
                        
                        cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                        cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
                    }
                    sendResponse({response: "received"});
                }
              );
        });
    }        


}
