const defineCycleStructure = (frequencies) => {
    let structure = [];

    for(let pomodoroIndex = 1; pomodoroIndex <= frequencies.longBreak; pomodoroIndex++){
        structure.push("Pomodoro");
        if((pomodoroIndex % frequencies.shortBreak === 0) && (pomodoroIndex != frequencies.longBreak)){
            structure.push("Pausa Curta");
        }
    }
    structure.push("Pausa Longa");

    return structure;
}

const createHTMLCycleTimers = (cycleTimersContainer, cycleStructure) => {
    cycleStructure.forEach( (cycleTimerName) => {
        const cssClass = (cycleTimerName === "Pausa Curta" 
                            ? "shortBreakCircle"
                        : cycleTimerName === "Pausa Longa"
                            ? "longBreakCircle" : "pomodoroCircle");
        
        const cycleTimerElement = document.createElement("div");
        cycleTimerElement.classList.add(cssClass);
        cycleTimersContainer.appendChild(cycleTimerElement);
    });
}

const getCurrentTimerIndicator = () => {
    const currentTimerIndicator = document.createElement('div');
    currentTimerIndicator.id = "currentTimerIndicator";
    return currentTimerIndicator;
}

const fillHTMLCycleTimer = (cycleTimersContainer, currentTimerIndex) => {
    const cycleTimersElements = cycleTimersContainer.children;

    for(let i = 0; i < currentTimerIndex; i++){
        cycleTimersElements[i].classList.add("filled");
    }

    const numberOfTimers = cycleTimersElements.length;
    if(currentTimerIndex + 1 != numberOfTimers){
        const currentTimerIndicator = getCurrentTimerIndicator();
        cycleTimersElements[currentTimerIndex].appendChild(currentTimerIndicator);
    }
}

const resetHTMLCycleTimer = (cycleTimersContainer, currentTimerIndex) => {
    const cycleTimersElements = cycleTimersContainer.children;
    const numberOfTimers = cycleTimersElements.length;

    for(let i = 0; i < numberOfTimers; i++){
        cycleTimersElements[i].classList.remove("filled");
    }

    const currentTimerIndicator = document.querySelector("#currentTimerIndicator");
    currentTimerIndicator.remove();
}

const cycle = { defineCycleStructure, createHTMLCycleTimers, fillHTMLCycleTimer, resetHTMLCycleTimer };

export default cycle;
