const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const remoteMain  = require("@electron/remote/main")

let main;
remoteMain .initialize();

const createWindow = () => {
    main = new BrowserWindow({
        // width: 360,
        // minWidth: 360,
        // maxWidth: 360,
        // height: 500,
        // frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    main.loadFile(path.join(__dirname, './view/index.html'));
    main.setTitle(`Grafana Backup & Restore - Saulo Costa`);
    main.webContents.openDevTools();
    remoteMain.enable(main.webContents);
    main.maximize();
};

/* app */
app.on('ready', () => createWindow());
app.on('window-all-closed', () => (process.platform !== 'darwin') ? app.quit() : '');
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 ? createWindow() : '');

/* code */
ipcMain.on('saveDash', (event, args) => {
    console.log(args);
})