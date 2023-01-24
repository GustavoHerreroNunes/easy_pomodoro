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

const cycle = { defineCycleStructure };

export default cycle;
