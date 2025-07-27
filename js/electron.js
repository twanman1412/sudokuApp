/**
 * Electron Main Process Configuration
 * Sets up the main application window and handles app lifecycle
 */

const { app, BrowserWindow } = require('electron');

/**
 * Create the main application window
 * @returns {BrowserWindow} The created window instance
 */
const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	mainWindow.maximize();
	mainWindow.loadFile('index.html');

	return mainWindow;
};

// App event handlers
app.whenReady().then(() => {
	createWindow();

	// macOS: Re-create window when dock icon is clicked
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
