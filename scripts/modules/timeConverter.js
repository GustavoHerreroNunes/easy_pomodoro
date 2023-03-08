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

const minutesAndSecondsToMinutes = (minutesAndSeconds) => {
    const [ strMinutes, strSeconds ] = minutesAndSeconds.split(":");
    const numberSeconds = parseInt(strSeconds);
    let numberMinutes = parseInt(strMinutes);

    numberMinutes += secondsToMinutes(numberSeconds);

    return numberMinutes;
}

const timeConverter = { secondsToMinutes, millisToSeconds, millisToMinutesAndSeconds, minutesAndSecondsToMinutes }

export default timeConverter;