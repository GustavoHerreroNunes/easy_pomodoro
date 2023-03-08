import webStorage from "./webStorage.js";
import indexedDBController from "./indexedDB.js";
import timeConverter from "./modules/timeConverter.js";
import timer from "./timer.js";
import cycle from "./cycle.js";

const getHTMLElements = () => {
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

const updatePopupInterface = () => {
    const { timerName,
        timerStatus, 
        timerDisplay, 
        cycleButtons, 
        timerButtons, 
        cycleIndicator } = getHTMLElements();

    const currentStatus = webStorage.getTimerStatus();
    timerStatus.innerHTML = currentStatus;

    switch(currentStatus){
        case "Iniciado":
            cycleButtons.container.classList.add("hide");
            timerButtons.container.classList.remove("hide");
            cycleIndicator.container.classList.add("hide");
            timerButtons.btnPlay.classList.add("hide");
            timerButtons.btnPause.classList.remove("hide");
            break;
        case "Pausado":
            cycleButtons.container.classList.add("hide");
            timerButtons.container.classList.remove("hide");
            cycleIndicator.container.classList.add("hide");
            timerButtons.btnPlay.classList.remove("hide");
            timerButtons.btnPause.classList.add("hide");

            const delayTimeInMills = parseInt(webStorage.getDelayTime());
            const delayTimeMinutesAndSeconds = timeConverter.millisToMinutesAndSeconds(delayTimeInMills);
            timerDisplay.innerHTML = delayTimeMinutesAndSeconds;
            break;
        case "Cancelado":
        case "Não Iniciado":
            cycleButtons.container.classList.remove("hide");
            timerButtons.container.classList.add("hide");
            cycleIndicator.container.classList.remove("hide");

            cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
            cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
            cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
            break;
        default:
            console.log(`Status não reconhecido - ${currentStatus}`);
            break;
    }
}

const initializePopUpInterface = (db, timerName, timerDisplay) => {
    const currentTimer = webStorage.getCurrentTimerName();
    indexedDBController.getRegistry(db, currentTimer, (registry) => {
        const time = registry.time;
        timerDisplay.innerHTML = time;
        timerName.innerHTML = currentTimer;
        updatePopupInterface();
    });
}

const updateTimerDisplay = (timerDisplay) => {
    return setInterval( () => {
        timer.getCurrentDelayTime((delayTime) => {
            const newTime = timeConverter.millisToMinutesAndSeconds(delayTime);
            timerDisplay.innerHTML = newTime;
        });
    }, 100);
}

const startTimer = (db, timerDisplay) => {
    const currentTimer = webStorage.getCurrentTimerName();
    
    indexedDBController.getRegistry(db, currentTimer, (timerRegistry) => {
        const delayInMinutes = timerRegistry.time;

        timer.initializeTimer(timeConverter.minutesAndSecondsToMinutes(delayInMinutes));

        webStorage.setTimerStatus("Iniciado");   
        updatePopupInterface();
    });
    
    const intervelId = updateTimerDisplay(timerDisplay);

    return intervelId;
}

const pauseTimer = (intervalId) => {
    clearInterval(intervalId);
    timer.getCurrentDelayTime((delayTime) => {
        timer.stopTimer();

        webStorage.setDelayTime(delayTime);

        webStorage.setTimerStatus("Pausado");
        updatePopupInterface();
    });
}

const continueTimer = (timerDisplay) => {
    const delayTimeInMills = parseInt(webStorage.getDelayTime());
    const delayTimeInMinutes = timeConverter.secondsToMinutes(timeConverter.millisToSeconds(delayTimeInMills));
    
    timer.initializeTimer((delayTimeInMinutes >= 1) ? delayTimeInMinutes : 1);
    
    webStorage.setTimerStatus("Iniciado");   
    updatePopupInterface();
    
    const intervelId = updateTimerDisplay(timerDisplay);

    return intervelId;
}

const cancelTimer = (intervalId) => {
    timer.stopTimer();
    
    clearInterval(intervalId);

    webStorage.setTimerStatus("Cancelado");
    updatePopupInterface();
}

const nextTimer = (db, timerName, timerDisplay) => {
    const isNextTimerDefined = timer.setNextTimer();
    if(isNextTimerDefined){
		webStorage.setTimerStatus("Não Iniciado");
        initializePopUpInterface(db, timerName, timerDisplay);
    }else{
        window.location.href = "finishedCycles.html";
    }
}

const verifyAlarmStatus = (onPlayed, onNotPlayed) => {
    webStorage.getAlarmStatus((alarmStatus) => {
        if(alarmStatus === "Tocou"){
            onPlayed();
        }else{
            onNotPlayed();
        }
    });
}

window.onload = () => {
    const { timerName,
            timerStatus, 
            timerDisplay, 
            cycleButtons, 
            timerButtons, 
            cycleIndicator } = getHTMLElements();

    let intervalId = 0;

    webStorage.defineStorage();
    const currentCycle = webStorage.getCurrentCycle();
    const numberOfCycles = webStorage.getNumberOfCycles();
    if(currentCycle > numberOfCycles){
        window.location.href = "finishedCycles.html";
    }else{
        indexedDBController.openDatabase((db) => {
    
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
                    intervalId = startTimer(db, timerDisplay);
                });
    
            cycleButtons.btnJump.addEventListener(
                'click',
                () => {
                    nextTimer(db, timerName, timerDisplay);
                }
            );
            
            timerButtons.btnPause.addEventListener(
                'click',
                () => {
                    console.log(`[intervalId.pauseTimer] - ${intervalId}`);
                    pauseTimer(intervalId);
                }
            );
    
            timerButtons.btnPlay.addEventListener(
                'click',
                () => {
                    intervalId = continueTimer(timerDisplay);
                    console.log(`[intervalId.continueTimer] - ${intervalId}`);
                }
            );
    
            timerButtons.btnCancel.addEventListener(
                'click',
                () => {
                    cancelTimer(intervalId);
                    initializePopUpInterface(db, timerName, timerDisplay);
                }
            );

            cycleIndicator.btnResetCycles.addEventListener(
                'click', 
                () => {
                    webStorage.resetCurrentSessionData();
                    webStorage.setTimerStatus("Não Iniciado");
                    initializePopUpInterface(db, timerName, timerDisplay);
                    cycleIndicator.cycleNumber.innerHTML = webStorage.getCurrentCycle();
                    cycle.resetHTMLCycleTimer(cycleIndicator.cycleTimers);
                    cycle.fillHTMLCycleTimer(cycleIndicator.cycleTimers, webStorage.getCurrentTimerIndex());
                }
            );

            chrome.runtime.onMessage.addListener(
                (request, sender, sendResponse) => {
                    if(request.onAlarm){
                        clearInterval(intervalId);
                        nextTimer(db, timerName, timerDisplay);
                        
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

            verifyAlarmStatus(() => {
                webStorage.setAlarmStatus("Não Tocou", () => {
                    clearInterval(intervalId);
                    nextTimer(db, timerName, timerDisplay);
                });
            }, () => {
                initializePopUpInterface(db, timerName, timerDisplay);
            });
            
            chrome.storage.onChanged.addListener( async (changes, area) => {
                if(area === "local"){
                    verifyAlarmStatus(() => {
                        webStorage.setAlarmStatus("Não Tocou");
                        clearInterval(intervalId);
                        nextTimer(db, timerName, timerDisplay);
                    }, () => {
                        initializePopUpInterface(db, timerName, timerDisplay);
                    });
                }
            })
        });
    }        


}
