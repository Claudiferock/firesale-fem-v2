const { app, BrowserWindow } = require('electron');   // switched electron for app as its more lazy way to go about

// Our BrowserWindow is defined here so it wont get garbage collected for being inside the event listener.
let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ show: false });

    mainWindow.loadFile(`${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.timeEnd("Time taken to be ready: ");
    });
});

console.log('Starting up...');
console.time("Time taken to be ready: ");
