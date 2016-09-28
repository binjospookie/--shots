<p align="center"> <img src="http://shots.binjo.ru/src/icongh.png" alt="logotype" /> </p>

# --shots 
An application for creating screenshots. It's simple and free!<br />
Just download the package for your OS and start working!<br />
You can save the screenshot locally, the file is base64 or send it to the server and get the link.<br />
To access the tools use the global menu, context menu(by pressing the right mouse button) or shortcuts.<br />
[Project's site with video](http://shots.binjo.ru)

## Available tools
* Arrow
* Crop
* Pen
* Rect<br />

> Press `F2` to see all shortcuts.

## Used technologies
* Electron
* HTML
* CSS
* PostCSS
* JavaScript
* NodeJs
* PHP

## How can I save screenshots on my own server?
* Download the source code
* Put `functions.php` and `savePhoto.php` on your server
* Open `scripts -> functions -> sendToServer.js`
* Replace `http://shots.binjo.ru/savephoto.php` by `pathToYourSavephoto.php`
* Open terminal and go to --shots directory
* Run `npm install`
* Run `npm run && nnpm start` or build project for your OS (see [here](http://electron.atom.io/docs/development/))
