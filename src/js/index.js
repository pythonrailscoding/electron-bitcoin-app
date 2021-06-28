const electron = require("electron");
const path = require("path");
const BrowserWindow = electron.remote.BrowserWindow
const axios = require("axios");
const ipc = electron.ipcRenderer;

// Deal with notification
let targetPriceVal;
const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target score!!',
    icon: path.join(__dirname, '../assets/icons/btc.ico')
}

const notifyBtn = document.getElementById("notifyBtn");
notifyBtn.addEventListener("click", function (){
    // Overwrite our Main Window to a subsidiary small window
    const modelPath = path.join("file://", __dirname, "add.html")
    let win = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.on("close", () => {
        win = null;
    })
    win.loadURL(modelPath);
    win.show();
})

const price = document.querySelector("h1");
const targetPrice = document.getElementById("targetPrice");

// Make a function and call it after every 60 seconds or 1 minute
function getBTC() {
    axios.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD")
        .then(res => {
            const cryptos = res.data.BTC.USD;
            price.innerHTML = '$'+cryptos.toLocaleString('en');
            if (targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD){
                const notify = new window.Notification(notification.title, notification);
            }
        })
}

getBTC();
// Prices refreshes every minute
setInterval(getBTC, 60000);

ipc.on("targetPriceVal", (event, arg) => {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en');
})

