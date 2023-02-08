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
        container: document.querySelector("#cycleIndicator"),
        cycleNumber: document.querySelector("#cycleNumber"),
        cycleTimers: document.querySelector("#cycleTimers"),
        currentTimerIndicator: document.querySelector("#currentTimerIndicator"),
        btnResetCycles: document.querySelector("#btnResetCycles")
    }

    return { timerName, timerStatus, timerDisplay, cycleButtons, timerButtons, cycleIndicator }
}

const changeStatus = (timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    const newStatus = webStorage.getTimerStatus();

    timerStatus.innerHTML = newStatus;
    switch(newStatus){
        case "Iniciado":
            cycleButtons.container.classList.add("hide");
            timerButtons.container.classList.remove("hide");
            timerButtons.btnPlay.classList.add("hide");
            timerButtons.btnPause.classList.remove("hide");
            cycleIndicator.container.classList.add("hide");
            break;
        case "Pausado":
            timerButtons.btnPlay.classList.remove("hide");
            timerButtons.btnPause.classList.add("hide");
            break;
        case "Cancelado":
        case "Não Iniciado":
            cycleButtons.container.classList.remove("hide");
            timerButtons.container.classList.add("hide");
            cycleIndicator.container.classList.remove("hide");
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

const initializePopUpInterface = (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    initializeTimerDisplay(db, timerDisplay);
    changeStatus(timerStatus, cycleButtons, timerButtons, cycleIndicator);
    const timerNewName =  webStorage.getCurrentTimerName();
    console.log(`[timerNewName] - ${timerNewName}`);
    timerName.innerHTML = timerNewName;
}

const updateTimerDisplay = (timerDisplay) => {
    return setInterval( () => {
        timer.getCurrentDelayTime((delayTime) => {
        setTimerDisplay(timerDisplay, millisToMinutesAndSeconds(delayTime))
    },
    1000);
});
}

const startTimer = (db, timerStatus, timerDisplay, cycleButtons, timerButtons, cycleIndicator) => {
    const currentTimer = webStorage.getCurrentTimerName();
    
    indexedDBController.getRegistry(db, currentTimer, (timerRegistry) => {
        const delayInMinutes = timerRegistry.time;

        timer.initializeTimer(minutesAndSecondsToMinute(delayInMinutes));
    
        webStorage.setTimerStatus("Iniciado");   
        changeStatus(timerStatus, cycleButtons, timerButtons, cycleIndicator);
    });
    
    const intervelId = updateTimerDisplay(timerDisplay);

    return intervelId;
}

const pauseTimer = (intervalId, timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    timer.getCurrentDelayTime((delayTime) => {
        timer.stopTimer();

        webStorage.setDelayTime(delayTime);

        clearInterval(intervalId);

        webStorage.setTimerStatus("Pausado");
        changeStatus(timerStatus, cycleButtons, timerButtons, cycleIndicator);
    })
}

const continueTimer = (timerStatus, cycleButtons, timerButtons, timerDisplay, cycleIndicator) => {
    const delayTimeInMills = parseInt(webStorage.getDelayTime());
    const delayTimeInMinutes = secondsToMinutes(millisToSeconds(delayTimeInMills));

    timer.initializeTimer((delayTimeInMinutes >= 1) ? delayTimeInMinutes : 1);
    
    webStorage.setTimerStatus("Iniciado");   
    changeStatus(timerStatus, cycleButtons, timerButtons, cycleIndicator);

    const intervelId = setInterval(updateTimerDisplay, 1000, timerDisplay);

    return intervelId;
}

const cancelTimer = (intervalId, timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    timer.stopTimer();
    
    clearInterval(intervalId);

    webStorage.setTimerStatus("Cancelado");
    changeStatus(timerStatus, cycleButtons, timerButtons, cycleIndicator);
}

const nextTimer = (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    const isNextTimerDefined = timer.setNextTimer();
    if(isNextTimerDefined){
		webStorage.setTimerStatus("Não Iniciado");
        initializePopUpInterface(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
    }else{
        window.location.href = "finishedCycles.html";
    }
}

const requestAlarmStatus = async (db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator) => {
    const response = await chrome.runtime.sendMessage({message: "alarmStatus"});
    if(response.alarmStatus === "PLAYED"){
        nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
        
        cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
        cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
        cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
    }
    else{
        initializePopUpInterface(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
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
            requestAlarmStatus(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
    
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
                    intervalId = startTimer(db, timerStatus, timerDisplay, cycleButtons, timerButtons, cycleIndicator);
                });
    
            cycleButtons.btnJump.addEventListener(
                'click',
                () => {
                    nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
                    cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
    
                    cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                    cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
                }
            );
            
            timerButtons.btnPause.addEventListener(
                'click',
                () => {
                    pauseTimer(intervalId, timerStatus, cycleButtons, timerButtons, cycleIndicator);
                }
            );
    
            timerButtons.btnPlay.addEventListener(
                'click',
                () => {
                    intervalId = continueTimer(timerStatus, cycleButtons, timerButtons, timerDisplay, cycleIndicator);
                }
            );
    
            timerButtons.btnCancel.addEventListener(
                'click',
                () => {
                    cancelTimer(intervalId, timerStatus, cycleButtons, timerButtons, cycleIndicator);
                    initializeTimerDisplay(db, timerDisplay);
                }
            );

            cycleIndicator.btnResetCycles.addEventListener('click', () => {
                webStorage.resetCurrentSessionData();
				webStorage.setTimerStatus("Não Iniciado");
                initializePopUpInterface(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
                cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
                cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
            });

            chrome.runtime.onMessage.addListener(
                (request, sender, sendResponse) => {
                    if(request.onAlarm){
                        clearInterval(intervalId);
                        nextTimer(db, timerName, timerDisplay, timerStatus, cycleButtons, timerButtons, cycleIndicator);
                        
                        cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
                        cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                        cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
                    }
                    sendResponse({response: "received"});
                }
              );

            if(webStorage.getTimerStatus() === "Iniciado"){
                intervalId = updateTimerDisplay(timerDisplay);
            }
        });
    }        


}
