import { ipcRenderer, remote } from 'electron';
import fs from 'fs';

class FileManager {
  constructor({ editor, monaco }) {
    this.editor = editor;
    this.monaco = monaco;
    this.name = ".";

    // When we receive a 'open-file' message, open the file
    //ipcRenderer.on('open-file', (e, url) => this.openFile(url));

    document.querySelector('#save').onclick = () => this.saveFile();
    document.querySelector('#new').onclick = () => this.newFile();
  }

  openFile(url) {
    // fs.readFile doesn't know what `file://` means
    const parsedUrl = (url.slice(0, 7) === 'file://') ? url.slice(7) : url;

    this.name = parsedUrl;

    fs.readFile(parsedUrl, 'utf-8', (err, data) => {
      this.editor.setModel(this.monaco.editor.createModel(data, 'plaintest'));
    });
  }

  newFile() {
    this.name = ".";
    this.editor.setModel(this.monaco.editor.createModel("", 'plaintest'));
  }

  saveFileCall(callback) {
    if (this.name === ".") {
      remote.dialog.showSaveDialog({ filters: [{ name: 'Turing File', extensions: ['t'] }] },
        (filename) => {
          if (!filename) return;
          this.name = filename;
          this.actualSaveCall(callback);
        }
      );
    }
    else {
      this.actualSaveCall(callback);
    }
  }

  saveFile() {
    if (this.name === ".") {
      remote.dialog.showSaveDialog({ filters: [{ name: 'Turing File', extensions: ['t'] }] },
        (filename) => {
          if (!filename) return;
          this.name = filename;
          this.actualSave();
        }
      );
    }
    else {
      this.actualSave();
    }
  }

  actualSave() {
    const model = this.editor.getModel();
    let data = '';
    model._lines.forEach((line) => {
      data += line.text + model._EOL;
    });
    fs.writeFile(this.name, data.slice(0, -2), 'utf-8');
  }

  actualSaveCall(callback) {
    const model = this.editor.getModel();
    let data = '';
    model._lines.forEach((line) => {
      data += line.text + model._EOL;
    });
    fs.writeFile(this.name, data.slice(0, -2), 'utf-8', callback());
  }

}

module.exports = FileManager;
