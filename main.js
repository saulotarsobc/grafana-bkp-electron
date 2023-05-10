const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const remoteMain = require("@electron/remote/main");
const { writeFile } = require('fs').promises;

let main;
remoteMain.initialize();

const createWindow = () => {
    main = new BrowserWindow({
        width: 459,
        // maxWidth: 459
        // minWidth: 459,

        // height: 564,
        // maxHeight: 564,
        // minHeight: 564,

        // resizable: false,
        frame: false,
        autoHideMenuBar: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    main.loadFile(path.join(__dirname, './view/index.html'));
    main.setTitle(`Grafana Backup & Restore - Saulo Costa`);
    remoteMain.enable(main.webContents);
    main.webContents.openDevTools();
    main.maximize();
};

/* app */
app.on('ready', () => createWindow());
app.on('window-all-closed', () => (process.platform !== 'darwin') ? app.quit() : '');
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 ? createWindow() : '');

/* code */
ipcMain.on('wc', (e, a) => {
    switch (a) {
        case 0: main.minimize(); break;
        case 1: main.isMaximized() ? main.restore() : main.maximize(); break;
        case 2: app.quit(); break;
    }
});

ipcMain.on('DASHS_DOWNLOADED', (e, DASHS_DOWNLOADED) => {

    dialog.showOpenDialog(null, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            DASHS_DOWNLOADED.map(({ title, dashboard }) => {
                const pathAndFileName = path.resolve(result.filePaths[0], `${title}.json`)
                writeFile(pathAndFileName, JSON.stringify(dashboard))
                    .then(() => {
                        /* alert on success */
                        main.webContents.send('saveAnd', {
                            success: true,
                            title,
                            dashboard,
                            message: "Baixado",
                            error: "",
                        });
                    })
                    .catch(e => {
                        /* alert on fail */
                        main.webContents.send('saveAnd', {
                            success: false,
                            title,
                            dashboard,
                            message: "Falha!",
                            error: e.message,
                        });
                    })
            });
        }
    }).catch(err => {
        console.log(err);
    });


})