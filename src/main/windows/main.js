/* global __static */

import {
  BrowserWindow,
  globalShortcut,
  screen,
  systemPreferences
} from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { autoUpdater } from "electron-updater";

const isDevelopment = process.env.NODE_ENV !== "production";

export default async () => {
  // Create the browser window.
  const display = screen.getPrimaryDisplay().workAreaSize; //1440,2560
  const winWidth = display.width;
  const winHeight = Math.floor(display.height / 3);
  const offsetY = winHeight * 2;
  let browserOptions = {
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      experimentalFeatures: true,
      enableRemoteModule: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js")
    },
    width: winWidth,
    height: winHeight,
    x: 0,
    y: offsetY,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    minimizable: false,
    closable: false,
    autoHideMenuBar: true,
    hasShadow: true,
    skipTaskbar: true,
    vibrancy: "light", //macos
    icon: path.join(__static, "icon.png"),
    title: "ClipBoard",
    titleBarStyle: "hidden",
    show: false
  };
  if (isDevelopment) {
    browserOptions.show = true;
  }
  if (systemPreferences.isAeroGlassEnabled()) {
    browserOptions.transparent = true;
    browserOptions.frame = false;
  }
  const win = new BrowserWindow(browserOptions);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on("close", e => {
    e.preventDefault();
    win.hide();
  });

  win.on("show", () => {
    globalShortcut.register("Esc", () => {
      win.hide();
    });
  });
  win.on("hide", () => {
    globalShortcut.unregister("Esc");
  });
  //为了让画面显示时没有视觉闪烁，
  // win.once("ready-to-show", () => {
  //   win.show();
  // });

  return win;
};
