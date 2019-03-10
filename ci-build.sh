#!/bin/bash
# Copyright (C) 2019 Junpei Kawamoto
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
set -ev

yarn build:production
yarn dist

if [[ "${TRAVIS_PULL_REQUEST}" = "false" ]]; then
    exit 0
fi

brew tap jkawamoto/pixeldrain
brew install pixeldrain
pd -v


WIN_ID=$(basename $(pd upload dist/GooboxFileShare-0.3.0-setup_x64.exe))
echo "Dev build for Windows has been uploaded at ${WIN_ID}"

MAC_ID=$(basename $(pd upload dist/GooboxFileShare-0.3.0.dmg))
echo "Dev build for MacOS has been uploaded at ${MAC_ID}"

LINUX_ID=$(basename $(pd upload dist/GooboxFileShare-0.3.0.AppImage))
echo "Dev build for Linux has been uploaded at ${LINUX_ID}"

LIST_URL=$(pd create-list -t "GooboxFileShare-0.3.0" ${WIN_ID}:GooboxFileShare-0.3.0-setup_x64.exe ${MAC_ID}:GooboxFileShare-0.3.0.dmg ${LINUX_ID}:GooboxFileShare-0.3.0.AppImage)
echo "Download page for the dev builds are set up at ${LIST_URL}"

curl -XPOST -H 'Content-Type:application/json' $DISCORD_WEBHOOK -d @- <<EOF
{
  "embeds": [{
    "title": "Development build of $TRAVIS_PULL_REQUEST_BRANCH",
    "description": "Build [#$TRAVIS_BUILD_NUMBER]($TRAVIS_BUILD_WEB_URL) of $TRAVIS_REPO_SLUG@$TRAVIS_PULL_REQUEST_BRANCH: $LIST_URL",
    "url": "$LIST_URL",
    "color": "2664261",
    "thumbnail": {
      "url": "https://goobox.io/icon-192x192.png"
    }
  }]
}
EOF
