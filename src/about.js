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

import _openAboutWindow from "about-window";
import icon from "./assets/goobox.svg";

export const openAboutWindow = async () =>
  new Promise(resolve => {
    const about = _openAboutWindow({
      icon_path: icon,
      bug_report_url: "https://github.com/GooBox/file-share-app/issues",
      copyright: "© Goobox",
      homepage: "https://goobox.io/",
      license: "GPL-v3",
      win_options: {
        resizable: false,
        fullscreenable: false,
        minimizable: false,
        maximizable: false,
      },
    });
    about.on("closed", resolve);
  });

export default openAboutWindow;
