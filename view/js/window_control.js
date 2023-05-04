/* window control */
const window_control = (a) => { ipcRenderer.send('wc', a) }
document.querySelector('#minimizew')?.addEventListener('click', () => window_control(0));
document.querySelector('#maxmize')?.addEventListener('click', () => window_control(1));
document.querySelector('#close')?.addEventListener('click', () => window_control(2));