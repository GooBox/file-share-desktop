/*
 * Copyright (C) 2019 Junpei Kawamoto
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {app, BrowserWindow, shell} from "electron";
import * as log from "electron-log";
import {
  AppName,
  AppURL,
  BaseURL,
  DebugModeKey,
  DefaultHeight,
  DefaultWidth,
} from "./constants";
import {updateMenu} from "./menu";
import {getItem, setItem} from "./storage";
import {checkForUpdatesAndNotify} from "./updater";

const logLevel = {
  "-1": "debug",
  "0": "info",
  "1": "warn",
  "2": "error",
};

const strToBool = str => str && str.toLowerCase() === "true";

const onShowLog = () => {
  if (!shell.openItem(log.transports.file.file)) {
    log.warn("failed to open the log file");
  }
};

const onOpenDownload = () => {
  if (!shell.openItem(app.getPath("downloads"))) {
    log.warn("failed to open downloads folder");
  }
};

app.on("ready", async () => {
  let width = DefaultWidth;
  if (process.env.DEV_TOOLS) {
    width *= 2;
  }
  const mainWindow = new BrowserWindow({
    width,
    height: DefaultHeight,
    minWidth: DefaultWidth,
    minHeight: DefaultHeight,
    useContentSize: true,
    resizable: true,
    fullscreenable: true,
    title: AppName,
    backgroundColor: "#313131",
    webPreferences: {
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL(AppURL);

  if (process.env.DEV_TOOLS) {
    mainWindow.toggleDevTools();
  }

  const wc = mainWindow.webContents;
  wc.on("will-navigate", (e, url) => {
    if (url === BaseURL) {
      e.preventDefault();
      mainWindow.loadURL(AppURL);
    }
  });
  wc.on("console-message", (e, level, msg) => {
    e.preventDefault();
    msg = msg.replace(/%c/g, "");
    msg = msg.replace(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s*/, "");
    log[logLevel[level.toString()]](msg);
  });

  const onToggleDebugMode = async debug => {
    await setItem(wc, DebugModeKey, debug);
    updateMenu(debug, {
      onQuit: () => mainWindow.close(),
      onOpenDownload,
      onShowLog,
      onToggleDebugMode,
    });
    wc.reload();
  };

  updateMenu(strToBool(await getItem(wc, DebugModeKey)), {
    onQuit: () => mainWindow.close(),
    onOpenDownload,
    onShowLog,
    onToggleDebugMode,
  });
  app.on("window-all-closed", () => app.quit());

  await checkForUpdatesAndNotify();
});
