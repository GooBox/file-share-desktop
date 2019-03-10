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

import {Menu} from "electron";
import openAboutWindow from "./about";
import {AppName} from "./constants";

const editMenu = {
  label: "Edit",
  submenu: [
    {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
    {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
    {type: "separator"},
    {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
    {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
    {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      selector: "selectAll:",
    },
  ],
};

const debugMenuLabel = debug => {
  if (debug) {
    return "Disable Debug Mode";
  }
  return "Enable Debug Mode";
};

export const updateMenu = (
  debug,
  {onQuit, onOpenDownload, onShowLog, onToggleDebugMode}
) => {
  const template = [
    {
      label: AppName,
      submenu: [
        {label: "About Goobox", click: openAboutWindow},
        {label: "Show Log", click: onShowLog},
        {label: debugMenuLabel(debug), click: () => onToggleDebugMode(!debug)},
        {type: "separator"},
        {label: "Open Downloads Folder", click: onOpenDownload},
        {type: "separator"},
        {
          label: `Quit ${AppName}`,
          accelerator: "Command+Q",
          click: onQuit,
        },
      ],
    },
    editMenu,
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

export default updateMenu;
