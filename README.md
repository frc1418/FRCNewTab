# FRCNewTab
Custom new tab page for Chrome (other browsers coming soon) which displays information about a random FIRST Robotics Competition team along with a picture of their most recent robot.

![Screenshot](screenshots/1.png)
![Screenshot](screenshots/2.png)
![Screenshot](screenshots/3.png)

## Installation
The packaged extension can be downloaded [here](https://chrome.google.com/webstore/detail/agmoglelphhinnadfmbfodhkdagibkop/).
To install from source:  
1. Clone or download files.  
2. Open Chrome Extensions page and activate Developer Mode.  
3. Load Unpacked Extension, and locate the extension folder.  
4. Select the folder and click open.  
5. If you like, click options to go to the configuration page.  

This extension should work out of box. Settings can be configured in the Options link visible in the extensions menu.

## Packaging
The extension can easily be packaged into a zip for uploading to the Chrome Web Store by using GNU's `make` command. Simply navigate to the extension source directory and type `make`.

--------------------------------------------------------------------------------

This project is protected under the MIT license. More information in `LICENSE`.
