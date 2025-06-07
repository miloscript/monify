import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, Menu, app, dialog, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { attachEvents } from './ipc/main.ipc'

// App metadata
const APP_NAME = 'Monify'
const APP_VERSION = '1.8.0'
const APP_DESCRIPTION = 'Your personal finance management companion'
const APP_AUTHOR = 'Monify Team'
const APP_WEBSITE = 'https://monify.app'

// Set app name early, before other app setup
app.setName(APP_NAME)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    title: APP_NAME,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: APP_NAME,
      submenu: [
        {
          label: `About ${APP_NAME}`,
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: `About ${APP_NAME}`,
              message: APP_NAME,
              detail: `${APP_DESCRIPTION}\n\nVersion: ${APP_VERSION}\nAuthor: ${APP_AUTHOR}\nWebsite: ${APP_WEBSITE}`,
              icon: icon,
              buttons: ['OK']
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: `Hide ${APP_NAME}`,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideOthers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: `Quit ${APP_NAME}`,
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: `About ${APP_NAME}`,
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: `About ${APP_NAME}`,
              message: APP_NAME,
              detail: `${APP_DESCRIPTION}\n\nVersion: ${APP_VERSION}\nAuthor: ${APP_AUTHOR}\nWebsite: ${APP_WEBSITE}`,
              icon: icon,
              buttons: ['OK']
            })
          }
        },
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal(APP_WEBSITE)
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app metadata
  electronApp.setAppUserModelId('com.monify.app')

  // Set app about panel info (macOS)
  if (process.platform === 'darwin') {
    app.setAboutPanelOptions({
      applicationName: APP_NAME,
      applicationVersion: APP_VERSION,
      version: APP_VERSION,
      credits: `${APP_DESCRIPTION}\n\nBuilt with Electron and React`,
      authors: [APP_AUTHOR],
      website: APP_WEBSITE,
      iconPath: icon
    })
  }

  // Create application menu
  createMenu()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Attach the IPC events used for cross-process communication
  attachEvents()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
