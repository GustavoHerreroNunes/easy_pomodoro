import indexedDBController from "./indexedDB.js";
import webStorage from "./webStorage.js";
import timeConverter from "./modules/timeConverter.js";

const initializeElements = () => {
    const configForm = document.frmConfig;
    const timerForm = {
        pomodoro: {
            minutes: document.querySelector("#txbPomodoroMinutes"), 
            seconds: document.querySelector("#txbPomodoroSeconds")
        },
        shortBreak: {
            minutes: document.querySelector("#txbShortBreakMinutes"), 
            seconds: document.querySelector("#txbShortBreakSeconds")
        },
        longBreak: {
            minutes: document.querySelector("#txbLongBreakMinutes"), 
            seconds: document.querySelector("#txbLongBreakSeconds")
        },
        errorMessage: document.querySelector("#timers").querySelector(".errorMessage")
    }

    const cycleForm = {
        numberOfCycles: document.querySelector("#txbNumberOfCycles"),
        shortBreakFrequency: document.querySelector("#txbShortBreakFrequency"),
        longBreakFrequency: document.querySelector("#txbLongBreakFrequency"),
        errorMessage: document.querySelector("#cycles").querySelector(".errorMessage")
    }

    const cycleButtons = {
        btnSave: document.querySelector("#btnSave"),
        btnCancel: document.querySelector("#btnCancel")
    }

    return { configForm, timerForm, cycleForm, cycleButtons };
}

const showData = (db ,timerForm, cycleForm) => {
    const onGetSuccess = (registries) => {
        
        registries.forEach((registry) => {
            const [minutes, seconds] = registry.time.split(':');

            switch(registry.name){
                case "Pomodoro":
                    timerForm.pomodoro.minutes.value = minutes;
                    timerForm.pomodoro.seconds.value = seconds;
                    break;
                case "Pausa Curta":
                    timerForm.shortBreak.minutes.value = minutes;
                    timerForm.shortBreak.seconds.value = seconds;

                    cycleForm.shortBreakFrequency.value = registry.frequency;
                    break;
                case "Pausa Longa":
                    timerForm.longBreak.minutes.value = minutes;
                    timerForm.longBreak.seconds.value = seconds;
                    
                    cycleForm.longBreakFrequency.value = registry.frequency;
                    break;
            }
        });

        const numberOfCycles = webStorage.getNumberOfCycles();
        cycleForm.numberOfCycles.value = numberOfCycles;
    }

    indexedDBController.getAllRegistries(db, onGetSuccess);
}

const markElementsAsInvalid = (elements) => {
    elements.forEach((element) => {
        element.classList.add("invalid");
        element.addEventListener('change', (event) => {
            event.target.classList.remove("invalid");
        });
    })
}

const searchEmptyFields = (timerForm, cycleForm) => {
    let thereAreEmptyField = false;

    for(const timerFields in timerForm){
        if(timerFields !== "errorMessage"){
            const timerMinutesValue = parseInt(timerForm[timerFields].minutes.value);
            const timerSecondsValue = parseInt(timerForm[timerFields].seconds.value);
            if(timerMinutesValue <= 0 || !timerMinutesValue){
                thereAreEmptyField = true;
                markElementsAsInvalid([timerForm[timerFields].minutes]);
            }
            if(!timerSecondsValue && timerSecondsValue != 0){
                thereAreEmptyField = true;
                markElementsAsInvalid([timerForm[timerFields].seconds]);
            }
        }
    }

    for (const cycleField in cycleForm) {
        if(cycleField !== "errorMessage"){
            const cycleValue = parseInt(cycleForm[cycleField].value);
            if(!cycleValue || cycleValue <= 0){
                thereAreEmptyField = true;
                markElementsAsInvalid([cycleForm[cycleField]]);
            }
        }
    }
    return thereAreEmptyField;
}

const validateFrequencys = (cycleForm) => {
    if(cycleForm.shortBreakFrequency.value > cycleForm.longBreakFrequency.value){
        markElementsAsInvalid([cycleForm.shortBreakFrequency]);
        cycleForm.errorMessage.innerHTML = "A frequência da pausa curta deve ser menor que a da pausa longa";
        return false;
    }
    else if(cycleForm.shortBreakFrequency.value === cycleForm.longBreakFrequency.value){
        markElementsAsInvalid([cycleForm.shortBreakFrequency, cycleForm.longBreakFrequency]);
        cycleForm.errorMessage.innerHTML = "As frequências não podem ser iguais";
        return false;
    }
    else
        return true;
}

const saveData = (db, timerForm, cycleForm) => {
    const pomodoroTime = timerForm.pomodoro.minutes.value + ":" + timerForm.pomodoro.seconds.value;
    const shortBreakTime = timerForm.shortBreak.minutes.value + ":" + timerForm.shortBreak.seconds.value;
    const longBreakTime = timerForm.longBreak.minutes.value + ":" + timerForm.longBreak.seconds.value;

    const registries = [
        {name: "Pomodoro", time: pomodoroTime, frequency: null},
        {name: "Pausa Curta", time: shortBreakTime, frequency: cycleForm.shortBreakFrequency.value},
        {name: "Pausa Longa", time: longBreakTime, frequency: cycleForm.longBreakFrequency.value}
    ];

    const numberOfCycles = cycleForm.numberOfCycles.value;

    indexedDBController.updateRegistry(db, registries[0], () => {
        indexedDBController.updateRegistry(db, registries[1], () => {
            indexedDBController.updateRegistry(db, registries[2], () => {
                webStorage.setNumberOfCycles(numberOfCycles);
                window.location = "./index.html";
            });
        });
    });
}

window.onload = () => {
    const { timerForm, cycleForm, cycleButtons } = initializeElements();

    const onSuccessToOpenDatabase = (db) => {

        for (const cycleElement in cycleForm) {
            if(cycleElement !== "errorMessage"){
                cycleForm[cycleElement].addEventListener('change', (event) => {
                    if(event.target.value.length >= 2){
                        event.target.value = event.target.value.substring(0, 1);
                    }
                });
           }
        }

        for (const timerElement in timerForm) {
            if(timerElement !== "errorMessage"){
                timerForm[timerElement].minutes.addEventListener('change', (event) => {
                    let timerValue = event.target.value;
                    console.log(typeof timerValue);
                    if(timerValue.length >= 3){
                        event.target.value = timerValue.substring(0, 2);
                    }
                    if(timerValue.length < 2){
                        event.target.value = (timerValue.length === 0) ? "00" : "0"  + timerValue;
                    }
                });
                timerForm[timerElement].seconds.addEventListener('change', (event) => {
                    let timerValue = event.target.value;
                    if(timerValue.length >= 3){
                        event.target.value = timerValue.substring(0, 2);
                    }
                    if(timerValue.length < 2){
                        event.target.value = (timerValue.length === 0) ? "00" : "0"  + timerValue;
                    }
                });
           }
        }

        cycleButtons.btnSave.addEventListener("click", () => {
            const thereAreEmptyField = searchEmptyFields(timerForm, cycleForm)
            if(!thereAreEmptyField){
                const validation = validateFrequencys(cycleForm);
                if(validation){
                    saveData(db, timerForm, cycleForm);
                }
            }else{
                timerForm.errorMessage.innerHTML = "Preencha todos os campos";
            }
        })
        
        showData(db, timerForm, cycleForm);
    }
    
    indexedDBController.openDatabase(onSuccessToOpenDatabase);
}
