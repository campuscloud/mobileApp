//Backend-Dummy
var backendDummy = function () {
   this.implements = ["Backend"];

   this.doInit = function (obj) {
       InterfaceHelper.ensureImplements(this, Backend);

       console.log("Backend-Interface: Dummy-Implementierung");

       return true;
   };

   this.debug = function (msg) {
       // Debug-Meldung ausgeben, falls im Debug-Modus
       if (typeof this.config.debug !== 'undefined' && this.config.debug === true) {
           console.log(msg.toString());
       }
   }

   this.hasFunctionality = function (key) {
       console.log("Backend-Funktion hasFunctionality");

       return true;
   }

   this.setBackend = function (obj) {
       console.log("Backend-Funktion setBackend");

       return true;
   }

   this.doAuthentication = function (obj, loginSuccess, loginError) {
       console.log("Backend-Funktion doAuthentication");

       loginSuccess();
   }

   this.doReAuthentication = function () {
       console.log("Backend-Funktion doReAuthentication");

       return true;
   }

   this.isLoggedIn = function () {
       console.log("Backend-Funktion isLoggedIn");

       return true;
   };

   this.getDirectoryContent = function (obj) {
       console.log("Backend-Funktion getDirectoryContent");

       var obj = new Array();
       obj.push({
           path: "/test.txt",
           isDir: false,
           filesize: 123456
       }, {
           path: "/datei2.pdf",
           isDir: false,
           filesize: 2345678
       }, {
           path: "/ordner1",
           isDir: true,
           filesize: 0
       });

       return obj;
   }

   this.getRemainingSpace = function () {
       this.debug("Backend-Funktion getRemainingSpace");

       return true;
   }

   this.deleteObject = function (obj, successCallback, errorCallback) {
       this.debug("Backend-Funktion deleteObject");
       this.debug("Delete: " + this.host + this.webdav + obj.path);
       var debug = this.debug;

       $.ajax({
           'url': this.host + this.webdav + obj.path,
           type: 'DELETE',
           headers: {
               Accept: "application/json;odata=verbose"
           },
           success: function (result, textStatus, jqXHR) {
               if (jqXHR.status == 204) { //empty success response 
                   debug('Object deleted');
                   successCallback();
               } else {
                   debug('Object delete failed');
                   errorCallback();
               }
           },
           error: function (jqXHR, textStatus, errorThrown) {
               debug('Object deletion failed:' + jqXHR.responseText);
               errorCallback();
           }
       });
   }

   this.moveObject = function (obj, successCallback, errorCallback) {
       this.debug("Backend-Funktion moveObject");
       this.debug("Move from: " + this.host + this.webdav + obj.srcPath + " TO: " + this.host + this.webdav + obj.srcPath);
       var debug = this.debug;

       $.ajax({
           'url': this.host + this.webdav + obj.srcPath,
           type: 'MOVE',
           headers: {
               Accept: "application/json;odata=verbose",
               Destination: this.host + this.webdav + obj.targetPath
           },
           success: function (result, textStatus, jqXHR) {
               if (jqXHR.status == 201 || jqXHR.status == 204) { // created response || empty success response 
                   debug('Object moved');
                   successCallback();
               } else {
                   debug('Object move failed');
                   errorCallback();
               }
           },
           error: function (jqXHR, textStatus, errorThrown) {
               debug('Object move failed:' + jqXHR.responseText);
               errorCallback();
           }
       });
   }

   this.createFolder = function (obj, successCallback, errorCallback) {
       this.debug("Backend-Funktion createFolder");
       this.debug("Create folder: " + this.host + this.webdav + obj.path + obj.folderName);

       var debug = this.debug;
       $.ajax({
           'url': this.host + this.webdav + obj.path + obj.folderName,
           type: 'MKCOL',
           headers: {
               Accept: "application/json;odata=verbose"
           },
           success: function (result, textStatus, jqXHR) {
               if (jqXHR.status == 201) { // success response code
                   debug('Folder created');
                   successCallback();
               } else {
                   this.debug('Folder creation failed');
                   errorCallback();
               }
           },
           error: function (jqXHR, textStatus, errorThrown) {
               debug('Folder creation failed: ' + jqXHR.responseText);
               errorCallback();
           }
       });
   }

   this.uploadFile = function (obj, successCallback, errorCallback, file) {
       this.debug("Backend-Funktion uploadFile");

       this.doReAuthentication({});

       // Fehler, wenn die Funktion nicht gesetzt wurde
       if (this.uploadFunction) {
           var param = {
               path: this.host + this.webdav + obj.targetPath,
               username: this.username,
               password: this.password,
               authToken: this.authToken,
               fileSize: obj.fileSize
           };

           this.uploadFunction(param, successCallback, errorCallback, file);
       } else {
           errorCallback();
       }
   }

   this.downloadFile = function (obj, successCallback, errorCallback, targetFile) {
       this.debug("Backend-Funktion downloadFile");

       this.doReAuthentication({});

       // Fehler, wenn die Funktion nicht gesetzt wurde
       if (this.downloadFunction) {

           var param = [];
           var totalSize = 0;
           //Mehrere Dateien gleichzeitig
           for (var i in obj) {
               param[i] = {
                   path: this.host + this.webdav + obj[i].dirName,
                   fileName: obj[i].fileName,
                   fileType: obj[i].fileType,
                   username: this.username,
                   password: this.password,
                   fileSize: obj[i].fileSize,
               };

               if (obj[i].fileSize && obj[i].fileSize >= 0) {
                   totalSize += obj[i].fileSize;
               }
           }

           this.downloadFunction(param, successCallback, errorCallback, targetFile, totalSize);
       } else {
           errorCallback();
       }
   }

   this.getDeletedFiles = function (obj, callbackList, errorCallback, frontendContext) {
       var callback = callbackList.pop();
       callback([], callbackList, errorCallback, frontendContext);
   }

   this.restoreFile = function (obj, successCallback, errorCallback) {
       errorCallback();
   }

   this.getVersions = function (obj, successCallback, errorCallback) {
       errorCallback();
   }

   this.restoreVersion = function (obj, successCallback, errorCallback) {
       errorCallback();
   }

   this.shareObject = function (obj, successCallback, errorCallback) {

   }

   this.getShareLink = function (obj, callbackList, errorCallback, context) {

   }

   this.unshareObject = function (obj, successCallback, errorCallback) {

   }

   this.getShareStatus = function (obj, successCallback, errorCallback) {

   }

   this.getShareAutocomplete = function (obj, callback) {
       callback({ shareTargets: [] });
   }

   this.fileeeAnalyse = function (obj, successCallback, errorCallback) {

   }

   this.getFileeeContent = function (obj, successCallback, errorCallback) {

   }
};