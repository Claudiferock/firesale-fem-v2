const { app, BrowserWindow } = require('electron');   // switched electron for app as its more lazy way to go about

// Our BrowserWindow is defined here so it wont get garbage collected for being inside the event listener.
let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow();

    mainWindow.loadFile(`${__dirname}/index.html`);
    console.timeEnd("Time taken to be ready: ");
});

console.log('Starting up...');
console.time("Time taken to be ready: ");
