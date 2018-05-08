const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

function createWindow () {
  win = new BrowserWindow({width: 800, height: 830, resizable: false, icon: path.join(__dirname, '/img/Pupil-Icon.png')});
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.on('ready', createWindow);

function dumpToFile(json) {
    fs.writeFile("../PupilData.json", unityifyJson(json), function(err) {
        if (err) {
            return console.error("ERROR: Cannot open file.");
        }  
        console.log("dumpin");
    });
}

function unityifyJson(json) {
    var ret = json.replace(/\[/g, '');
    ret = ret.replace(/]/g, '');
    ret = ret.replace(/{/g, '');
    ret = ret.replace(/}/g, '');
    ret = ret.replace(/"name":/g, '');
    ret = ret.replace(/"value":/g, '');
    ret = ret.replace(/"/g, '');
    ret = "{" + ret + "}";

    var count = 1;
    var i = 0;
    for (i; i < ret.length; i++) {
        if (ret[i] == ',') {
            if (count == 1) {
                count = -1;
                ret = replaceAt(ret, i, ':');
            }
            count++;
        }
    }

    //@TODO: This could be refactored and implemented like the hexadecimal replacement function.
    ret = ret.replace('left', '\"left\"');
    ret = ret.replace('right', '\"right\"');
    ret = ret.replace('minIPD', '\"minIPD\"');
    ret = ret.replace('maxIPD', '\"maxIPD\"');    
    ret = ret.replace('maxDistance', '\"maxDistance\"');
    ret = ret.replace('colorBlind', '\"colorBlind\"');
    ret = ret.replace('on', 'true');
    ret = ret.replace('off', 'false');
    ret = ret.replace('red', '\"red\"');
    ret = ret.replace('blue', '\"blue\"');
    ret = ret.replace('green', '\"green\"');
    ret = ret.replace('yellow', '\"yellow\"');

    var replaceHex = (str) => '\"' + str + '\"';

    ret = ret.replace(/#[a-fA-F0-9]+/g, function (match) {
        return replaceHex(match);
    });         

    return ret;
}

function replaceAt (original, index, str) {
    return original.substr(0, index) + str + original.substr(index + 1, original.length);
}
