const electron = require("electron");
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const ipc = require("electron").ipcMain;

let win;

function createWindow() {

    // Create our main window
    win = new BrowserWindow({
        height: 300,
        width: 800,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    // Set up URL for our template
    win.loadURL(url.format({
        pathname: path.join(__dirname, "src/templates/index.html"),
        protocol: "file:",
        slashes: true
    }))

    // Garbage collect when window closed
    win.on("closed", () => function () {
        win = null;
    })

    // Build a Menu
    let menu = electron.Menu.buildFromTemplate(mainMenuTemplate)
    electron.Menu.setApplicationMenu(menu);
}

if (process.platform === 'darwin'){
    mainMenuTemplate.unshift({});
}

const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Coin Market Cap",
                click() {
                    electron.shell.openExternal("https://coinmarketcap.com/")
                }
            },
            {
                type: "separator",
            },
            {
                label: "Quit",
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    },
    {
        label: "Tools",
        submenu: [
            {
                label: "Toggle Dev Tools",
                accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                role: "reload",
            }
        ]
    }
]

app.on('ready', createWindow)

// These are necessary other settings, not important to understand them
app.on("window-all-closed", () => {
    // On macOS, if exited, menu bar may remain, so destroy that if closed all programs
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

app.on("activate", () => {
    // MacOS settings
    if(win === null){
        createWindow()
    }
})

ipc.on('update-notify-value', function (event, arg){
    win.webContents.send('targetPriceVal', arg);
})
