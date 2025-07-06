const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');

function fetchMessage() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '192.168.1.21',
      port: 443,
      path: '/',
      method: 'GET',
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, 'rootCA.pem'))
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('fetch-message', fetchMessage);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
