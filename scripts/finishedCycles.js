import webStorage from "./webStorage.js";

window.onload = () => {
    const btnResetCycles = document.querySelector("#btnResetCycles");
    btnResetCycles.addEventListener('click', () => {
        webStorage.resetCurrentSessionData();
        window.location.href = "index.html";
    })
}
