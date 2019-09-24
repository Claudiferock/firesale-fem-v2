const fs = require('fs');

const { app, BrowserWindow, dialog } = require('electron');   // switched electron for app as its more lazy way to go about

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

exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        properties: ['openFile'],
        buttonLabel: 'Unveil',
        title: 'Open Fire Sale Document',
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown', 'marcdown'] },
            { name: 'Text Files', extensions: ['txt', 'text'] }
        ]
    });

    if (!files) return; // this way we avoid undefined if user clicks calcel

    const file = files[0];

    openFile(file);
};

const openFile = (file) => {
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
};
