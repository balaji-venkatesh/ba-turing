import { remote } from 'electron';

// Minimize window
document.getElementById("minimize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.minimize();
});

// Maximize window
document.getElementById("maximize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});

// Close app
document.getElementById("close").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.close();
});