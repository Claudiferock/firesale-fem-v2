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

// shows popup window to open file
exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog(mainWindow, {
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

// Saves file
exports.saveMarkdown = (file, content) => {
    if (!file) {
        file = dialog.showSaveDialog(mainWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('desktop'), 
            filters: [
                { 
                    name: 'Markdonw Files',
                    extensions: ['md', 'mdown', 'markdown', 'marcdown'],
                },
                {
                    name: 'Text Files',
                    extensions: ['txt', 'text']
                },
            ],
        });
    }

    if (!file) return;

    fs.writeFileSync(file, content);
    //To show that you created a new file
    openFile(file)
};

// Saves HTML file
exports.saveHtml = content => {
    const file = dialog.showSaveDialog(mainWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('desktop'),
        filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
    });

    if (!file) return;

    fs.writeFileSync(file, content);
}

// Opens file
const openFile = file => {
    const content = fs.readFileSync(file).toString();
    //shows dropdown of recent files
    app.addRecentDocument(file);
    mainWindow.webContents.send('file-opened', file, content);
};
