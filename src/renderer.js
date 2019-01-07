import loader from 'monaco-loader';
import { remote, ipcRenderer, Menu, MenuItem} from 'electron';
import FileManager from './filemanager';
import spawn from 'child_process';

loader().then((monaco) => {
  const editor = monaco.editor.create(document.getElementById('container'), {
    language: 'plaintext',
    theme: 'vs-light',
    automaticLayout: true,
  });

  const fileManager = new FileManager({ editor, monaco });

  var data = ipcRenderer.sendSync('get-file-data');
  if (data === null) {
  } else {
    fileManager.openFile(data);
  }

  remote.getCurrentWindow().show();

  document.getElementById("open").addEventListener("click", (e) => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile',],
        filters: [{ name: 'Turing File', extensions: ['t'] }]
      },
      (fileNames) => {
        if (!fileNames) return;
        fileManager.openFile(fileNames[0]);
      }
    );
  });

  document.getElementById("run").addEventListener("click", (e) => {
    fileManager.saveFileName(function (filename) {
      spawn.exec("resources\\app\\turing\\turing.exe -compile " + filename, function (err, stdout, stderr) {
        spawn.exec("resources\\app\\turing\\TuringEXEProlog.exe -file " + filename + 'bc', function (err, stdout, stderr) {
          spawn.exec("del /f filename " + filename + 'bc');
        });
      });
    });
  });


});

