const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('capture-page', (event, arg) => {
    let win = new BrowserWindow({ width: 800, height: 600, show: true }); // show:false for hidden window
    win.loadURL(arg);
    // Use BrowserWindow or webContents to capture the page here
    // For example, mainWindow.webContents.capturePage()
});