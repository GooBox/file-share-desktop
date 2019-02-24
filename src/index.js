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

import {app, BrowserWindow} from "electron";
import {AppName, AppURL, DefaultHeight, DefaultWidth} from "./constants";
import {createMenu} from "./menu";

app.on("ready", () => {
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
  });
  mainWindow.loadURL(AppURL);

  if (process.env.DEV_TOOLS) {
    mainWindow.toggleDevTools();
  }

  createMenu(() => mainWindow.close());

  app.on("window-all-closed", () => app.quit());
});
