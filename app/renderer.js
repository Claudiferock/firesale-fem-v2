const path = require('path');

const marked = require('marked');
const { remote, ipcRenderer } = require('electron');

let filePath = null;
let originalContent = '';

// require in the context of the main process, using remote module
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

const updateUserInterface = isEdited => {
  let title = 'Fire Sale';

  if (filePath) {
    //we use path.basename(filePath) in order to avoid C:/Users/.../file.txt as a title and have only the title
    title = `${path.basename(filePath)} - ${title}`;
  } 

  if (isEdited) {
    title = `${title} (Edited)`;
  }

  if (filePath) currentWindow.setRepresentedFilename(filePath);
  currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
  //saveHtmlButton.disabled = !isEdited;
  
  currentWindow.setTitle(title);
}

markdownView.addEventListener('keyup', event => {
  const currentContent = event.target.value;
  
  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent !== originalContent);
});

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser();
});

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(filePath, markdownView.value);
});

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(htmlView.innerHTML);
});

ipcRenderer.on('file-opened', (event, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  //we pass false so it won't be taken as undefined and bring more errors
  updateUserInterface(false);
});