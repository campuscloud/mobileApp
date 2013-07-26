console.log("functions.js loaded");
// Allgemeine App-Funktionen definieren
if (!cloud.functions) {
    cloud.functions = {};
}

cloud.functions.login = function (authObj, serverObj, successCallback, errorCallback) {
    //MANUELLE SERVERKONFIGURATION
    if (serverObj.selectedServerType == "manual") {
        //BACKEND-TYP wählen...
        //Pfad zum Server
        if (serverObj.manualServerType == 1) { //OC
            var backendType = new Object({ type: "owncloud", host: serverObj.manualCloudServer /*port: serverObj.manualCloudPort*/ });
        }
        else if (serverObj.manualServerType == 2) { //SP
            var backendType = new Object({ type: "sharepoint", host: serverObj.manualCloudServer /*port: serverObj.manualCloudPort*/ });
        }
    }
        //Vorkonfiguriert
    else if (serverObj.selectedServerType) {
        var backendType = { type: "config", host: serverObj.selectedServer };
    }

    // Upload und Download
    //backendType.uploadFunction = cloud.functions.uploadFile;
    //backendType.downloadFunction = cloud.functions.downloadFile;

    //Backend festlegen und Anmelden
    if (backendType && authObj.password != "") {
        if (cloud.setBackend(backendType)) {
            tes
            cloud.doAuthentication(authObj, successCallback, errorCallback);
        } else {
            errorCallback("NOBACKEND");
        }
    }
    else {
        //Sofern es ein Atuologin war (start der App) und Login fehlgeschlagen ist, soll die Fehlermeldung nicht direkt bei Appstart angezeigt werden
        errorCallback();
    }
};

cloud.functions.initiateUploadFile = function (file) {
    console.log("initiateUploadFile");
    var successCallback = cloud.functions.performUpload;
    cloud.functions.uploadOptions.contentLength = file.size;
    cloud.functions.getFileData(file, successCallback);
}

cloud.functions.getFileData = function (file, successCallback) {
    console.log("getFileData");
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        successCallback(evt.target.result);
        console.log("read success");
    };
    reader.readAsArrayBuffer(file);
}


cloud.functions.upload = function (param, successCallback, errorCallback, fileEntry) {
    console.log("upload");
    cloud.functions.uploadOptions = {};
    cloud.functions.uploadOptions.url = param.path + "/" + fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
    cloud.functions.uploadOptions.successCallback = successCallback;
    cloud.functions.uploadOptions.errorCallback = errorCallback;
    cloud.functions.uploadOptions.authToken = param.authToken;
    fileEntry.file(cloud.functions.initiateUploadFile);
};

cloud.functions.performUpload = function (data) {
    console.log("performUpload");
    var xhr = new XMLHttpRequest();
    var url = cloud.functions.uploadOptions.url;
    var successCallback = cloud.functions.uploadOptions.successCallback;
    var errorCallback = cloud.functions.uploadOptions.errorCallback;
    var authToken = cloud.functions.uploadOptions.authToken;
    var contentLength = cloud.functions.uploadOptions.contentLength;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) { // complete.
            if (xhr.status >= 200 && xhr.status < 300) {
                successCallback(xhr.response);
            } else {
                // response not successful
                var error = /<d:error/;
                if (error.test(xhr.responseText)) {
                    errorCallback("Error. ResponseText: " + xhr.responseText);
                    cloud.functions.uploadOptions.responseText = xhr.responseText;
                } else {
                    // eig auch fehler
                }
            }
        }
    };
    xhr.open("PUT", url, !!successCallback);
    xhr.setRequestHeader("Content-Type", "text/html; charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Basic " + authToken);
    xhr.setRequestHeader("Connection", "Keep-Alive");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.setRequestHeader("Content-Length", contentLength);
    xhr.send(data);
},

cloud.functions.download = function (param, successCallback, errorCallback, targetFile, totalSize) {
    for (i in param) {
        var url = param[i].path + param[i].fileName + param[i].fileType;
        var fileName = param[i].fileName + param[i].fileType;
        var authToken = cloud.backend.authToken;
        console.log("Filename: " + fileName);
        console.log("URL: " + url);
        console.log("Token: " + authToken);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // complete.
                if (xhr.status >= 200 && xhr.status < 300) {
                    var data = this.response;
                    var blob = cloud.functions.getBlob(data);
                    successCallback(blob, fileName);
                } else {
                    // response not successfull
                    var error = /<d:error/;
                    if (error.test(xhr.responseText)) {
                        console.log("ResponseText: " + xhr.responseText);
                    } else {
                        console.log("Kein ResponseText vorhanden");
                    }
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader("Authorization", "Basic " + authToken);
        xhr.send();
        //var downloadFrame = document.createElement("iframe");
        //downloadFrame.setAttribute('src', url);
        //document.body.appendChild(downloadFrame);
        //window.open("http://" + cloud.backend.username + ":" + cloud.backend.password + "@" + url.replace("http://", ""), 'download_window', 'toolbar=0,location=no,directories=0,status=0,scrollbars=0,resizeable=0,width=1,height=1,top=0,left=0');
        //window.focus();
        //window.open("http://" + cloud.backend.username + ":" + cloud.backend.password + "@" + url.replace("http://", ""), '_blank', 'location=yes');
        //var ref = window.open("http://about:blank", '_blank', 'location=yes');
        //ref.addEventListener('loadstop', function (event) {
        //    window.location.href = "http://" + cloud.backend.username + ":" + cloud.backend.password + "@" + url.replace("http://", "");
        //});
    }
},

cloud.functions.onError = function (e) {
    console.log('There was an error', e);
},

cloud.functions.getBlob = function (data) {
    var bb = new BlobBuilder();
    var blob = "";
    bb.append(data);
    blob = bb.getBlob();
    return blob;
},

cloud.functions.performSave = function (blob, filename) {
    console.log("perform Save");
    console.log("window: " + window);
    window.requestFileSystem(
                  LocalFileSystem.PERSISTENT, 0,
                  function onFileSystemSuccess(fileSystem) {
                      console.log("onFileSystemSuccess, fileSystem: " + fileSystem);
                      fileSystem.root.getFile(filename, { create: true }, function (fileEntry) {
                          console.log("filesystem.root.getFile, fileEntry: " + fileEntry);

                          fileEntry.remove(
                              fileEntry.createWriter(function (fileWriter) {
                                  fileWriter.onwriteend = function (e) {
                                      cloud.functions.performSaveSuccess();
                                  };
                                  fileWriter.onerror = function (e) {
                                      cloud.functions.performSaveError(e);
                                  };
                                  fileWriter.write(blob);
                              }, cloud.functions.performSaveError));
                      }, cloud.functions.performSaveError);
                  })
},

cloud.functions.performSaveError = function (e) {
    console.log('Write failed: ' + e.toString());
},

cloud.functions.performSaveSuccess = function () {
    console.log('Write completed.');
}

cloud.functions.downloadSuccess = function (blob, filename) {
    console.log("downloadSuccess");
    cloud.functions.performSave(blob, filename);
},

cloud.functions.downloadError = function (e) {
    console.log("downloadError: " + e);
    $('body').removeClass('ui-loading');
}

cloud.functions.showLink = function (url) {
    alert(url);
    var divEl = document.getElementById("ready");
    var aElem = document.createElement("a");
    aElem.setAttribute("target", "_blank");
    aElem.setAttribute("href", url);
    aElem.appendChild(document.createTextNode("Ready! Click To Open."))
    divEl.appendChild(aElem);
}


//cloud.functions.performUploadAlt = function (data, options) {
//    console.log("perform upload");
//    var xhr = new XMLHttpRequest();
//    xhr.open(options.httpMethod, options.url, true);
//    xhr.overrideMimeType(options.mimeType);
//    xhr.setRequestHeader("Authorization", "Basic " + options.token);
//    xhr.send(data);
//}

//cloud.functions.uploadAlt = function (param, successCallback, errorCallback, fileEntry) {
//    var options = new FileUploadOptions();
//    options.chunkedMode = true;
//    options.fileKey = "file";
//    options.fileName = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
//    options.mimeType = "image/jpeg";
//    options.headers = { "Authorization": "Basic " + param.authToken };
//    console.log("start upload");
//    if ((typeof testEntry) != "undefined") {
//        testEntry = fileEntry;
//    }
//    var ft = new FileTransfer();
//    ft.upload(fileEntry.fullPath, param.path, cloud.pages.directory.uploadSucceed, cloud.pages.directory.uploadError, options);
//}
