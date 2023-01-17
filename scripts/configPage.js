import indexedDBController from "./indexedDB.js"

const initializeElements = () => {
    const timerForm = {
        pomodoro: document.querySelector("#txbPomodoroTime"),
        shortBreak: document.querySelector("#txbShortBreakTime"),
        longBreak: document.querySelector("#txbLongBreakTime")
    }

    const cycleForm = {
        numberOfCycles: document.querySelector("#txbNumberOfCycles"),
        shortBreakFrequency: document.querySelector("#txbShortBreakFrequency"),
        longBreakFrequency: document.querySelector("#txbLongBreakFrequency")
    }

    const cycleButtons = {
        btnSave: document.querySelector("#btnSave"),
        btnCancel: document.querySelector("#btnCancel")
    }

    return { timerForm, cycleForm, cycleButtons };
}

const showData = (db ,timerForm, cycleForm) => {
    const onGetSuccess = (event) => {
        const registries = event.target.result;
        
        registries.forEach((registry) => {
            switch(registry.name){
                case "Pomodoro":
                    timerForm.pomodoro.value = registry.time;
                    break;
                case "Pausa Curta":
                    timerForm.shortBreak.value = registry.time;
                    cycleForm.shortBreakFrequency.value = registry.frequency;
                    break;
                case "Pausa Longa":
                    timerForm.longBreak.value = registry.time;
                    cycleForm.longBreakFrequency.value = registry.frequency;
                    break;
            }
        });
    }

    indexedDBController.getRegistries(db, onGetSuccess);
}

window.onload = () => {
    const { timerForm, cycleForm, cycleButtons } = initializeElements();

    const openRequest = indexedDBController.openDatabase();

    openRequest.onupgradeneeded = indexedDBController.onUpgradeNeeded;

    openRequest.onerror = (event) => {
        const error = event.target.error;
        console.log(`Error occured when initializating the database: ${error}`);
    }

    openRequest.onsuccess = (event) => {
        console.log("Database on!");

        const db = event.target.result;

        console.log(db);

        showData(db, timerForm, cycleForm);
    }
    
}
