const showTimermNotification = () => {
    chrome.notifications.create({
        contextMessage: "Easy Pomodoro",
        iconUrl: "../assets/tomato.png",
        message: "Ding Ding Ding!",
        title: "Alarme Tocando",
        type: "basic",
        buttons: [{title: "Desligar"}, {title: "Iniciar Próximo Timer"}],
        requireInteraction: true
    })
}

chrome.alarms.onAlarm.addListener((alarm) => {
    (async () => {
        const response = await chrome.runtime.sendMessage({onAlarm: true});
        showTimermNotification();
        console.log(response);
      })();
});
