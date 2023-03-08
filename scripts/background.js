const showTimermNotification = () => {
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    const hoursMinuteAndSeconds = hours + ":" + (minutes < 10 ? '0' : '') + minutes;
    
    chrome.notifications.create({
        contextMessage: "Easy Pomodoro",
        iconUrl: "../assets/tomato.png",
        message: hoursMinuteAndSeconds,
        title: "Timer Encerrado",
        type: "basic",
        buttons: [{title: "Fechar"}],
        requireInteraction: true
    });
}

chrome.alarms.onAlarm.addListener(async () => {
    await chrome.storage.local.set({alarmStatus: "Tocou"});
    showTimermNotification();
});
