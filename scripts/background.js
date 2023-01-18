const showTimermNotification = () => {
    chrome.notifications.create({
        contextMessage: "Easy Pomodoro",
        iconUrl: "../assets/tomato.png",
        message: "Ding Ding Ding!",
        title: "Alarme Tocando",
        type: "basic",
        buttons: [{title: "Valeu Aí"}, {title: "Não enche!"}],
        requireInteraction: true
    })
}

chrome.alarms.onAlarm.addListener((alarm) => {
    showTimermNotification();
});
