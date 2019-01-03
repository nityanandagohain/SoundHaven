const {app, BrowserWindow, dialog, Menu} = require('electron')
  const electron = require('electron');
  const path = require('path')
  const url = require('url')
  const fs = require('fs');
  const storage = require('electron-json-storage');

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win

  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Open the DevTools.
     win.webContents.openDevTools()


    //Menu
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Open Folder',
            accelerator : 'Alt+o',
            click:function(){
              openFolderDialog();
            }
          },
          {
            label: 'Open File',
            accelerator : 'CommandOrControl+o',
            click: function(){
              openFileDialog();
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);



    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })


  function openFolderDialog(){
    console.log(
      dialog.showOpenDialog(win, {
        // properties: ['openFile']
        properties: ['openDirectory']
      },function(filePath){
        if(filePath){
          console.log(filePath[0]);
          fs.readdir(filePath[0], function(err, files){
            var arr = [];
            for(var i=0;i<files.length;i++){
              if(files[i].substr(-4) === '.mp3'){
                arr.push(filePath[0] + '/' + files[i]);
                }
            }

            //console.log("folder");
            console.log('arr',arr);
            win.webContents.send('mp3-file', arr); //sending the opened file to renderer process through ipc renderer via 'mp3-file' event
          });
        }
      })
    );
  }

  function openFileDialog(){
    dialog.showOpenDialog(win, {
      filters: [
        { name: 'Audio Files', extensions: ['mp3'] }
      ],
      properties: ['openFile']
    }, function(filePath){
      if(filePath){
        
          let arr = [];
          //console.log(filePath);
          arr.push(filePath[0]);
          //console.log(win.webContents);
          console.log('arr',arr);
          win.webContents.send('mp3-file', arr);  //sending the opened file to renderer process through ipc renderer via 'mp3-file' event
      }
    });
  }