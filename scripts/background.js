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

let alarmStatus = "NOT PLAYED";

chrome.alarms.onAlarm.addListener(async () => {
    alarmStatus = "PLAYED";
    showTimermNotification();
    try{
        await chrome.runtime.sendMessage({onAlarm: true});
        alarmStatus = "NOT PLAYED";
    }catch(error){
        console.error(`${error} - Popup was close when trying to make contact`);
    }      
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if(request.message === "alarmStatus"){
            sendResponse({alarmStatus: alarmStatus});
            alarmStatus = "NOT PLAYED";
        }
    }
)
