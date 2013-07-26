 /*********************************************************************************    
 The Campus Cloud software is available under a dual license of MIT or GPL v3.0
 Copyright (C) 2013
       Benjamin Barann, Arne Cvetkovic, Patrick Janning, Simon Lansmann,
       David Middelbeck, Christoph Rieger, Tassilo Tobollik, Jannik Weichert
 /********************************************************************************    
 MIT License:
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 See the MIT License for more details: http://opensource.org/licenses/MIT
 /*******************************************************************************
 GPL License:
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 /******************************************************************************/
console.log("cloud.pages.directory.js loaded");

var Stack = function () {
    this.stack = new Array();
    this.pop = function () {
        return this.stack.pop();
    };
    this.last = function () {
        var result = this.stack.pop();
        this.stack.push(result);
        return result;
    };
    this.push = function (item) {
        this.stack.push(item);
    };
    this.isEmpty = function () {
        return this.stack.length == 0;
    };
    this.length = function () {
        return this.stack.length;
    };
};
var History = function () {
    this.stack = new Array();
    this.last = function () {
        var result = this.stack.pop();
        this.stack.push(result);
        return result;
    };
    this.push = function (item) {
        var last = this.last();
        this.stack.push(item);
    };
};

// Reference page in cloud object for initialisation
cloud.pages.directory = {};

cloud.pages.directory = {
    items: Array(),
    pathHistory: new Stack(),
    currentSortType: "name",
    moveSrc: new Array(),
    renameSrc: new Array(),
    deleteSrc: new Stack(),
    contextHistory: new History(),
    selectionCounter: 0,
    shareObject: {
        permissionStack: new Array()
    },

    init: function () {
        // Events
        document.getElementById("backButton").onclick = cloud.pages.directory.backButtonClickedEvent;
        document.getElementById("menuButton").onclick = cloud.pages.directory.menuButtonClickedEvent;
        
        //Device Events
        document.addEventListener("deviceready", cloud.pages.directory.onDeviceReady, false);

        cloud.pages.directory.pathHistory.push("/");
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.reloadDirectory();

        // Navigation bar events for selections
        //Move
        $('.navbarMove').on('click', cloud.pages.directory.movePrepareEvent);
        //Rename
        $('.navbarRename').on('click', cloud.pages.directory.renamePrepareEvent);
        //Delete
        $('.navbarDelete').on('click', cloud.pages.directory.deletePrepareEvent);
        //Versions
        $('.navbarVersions').on('click', cloud.pages.directory.historyButtonClickedEvent);
        $('#historyPopupHistoryButton').on('click', cloud.pages.directory.restoreVersion);
        //Deleted Files
        $('#showDeletedButton').on('click', function () {
            $('#menuPopup').popup('close');
            setTimeout(cloud.pages.directory.restoreButtonClickedEvent, 500);
        });
        $('#restorePopupRestoreButton').on('click', cloud.pages.directory.restoreFile);

        $('.navbarShare').on('click', cloud.pages.directory.shareButtonClickedEvent);
        $('#sharePopupShareButton').on('click', cloud.pages.directory.sharePopupShareClickedEvent);
        $('.navbarRestore').on('click', cloud.pages.directory.restoreButtonClickedEvent);
        $('.navbarMoveTarget').on('click', cloud.pages.directory.moveElement);

        $('.navbarCancel').on('click', cloud.pages.directory.resetContext);

        // Menu
        $('#menuPopup').popup();
        document.getElementById("refreshButton").onclick = function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.reloadDirectory();
        };
        document.getElementById("logoutButton").onclick = function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.logoutButtonClickedEvent();
        };
        document.getElementById("uploadPictureButton").onclick = function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.capturePicture();
        };
        document.getElementById("uploadVideoButton").onclick = function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.captureVideo();
        };
        document.getElementById("uploadAudioButton").onclick = function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.captureAudio();
        };
        $('#createFolderButton').on('click', function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.createFolderPrepareEvent();
        });
        $('#downloadButton').on('click', function () {
            $('#menuPopup').popup('close');
            cloud.pages.directory.downloadPrepareEvent();
        });
    },

    restoreButtonClickedEvent: function () {
        $('#restorePopup').popup();
        $('#restorePopup').popup("open");
    },

    openShareDialog: function (autocomplete) {
        //Get file to share
        var headings = $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading');
        cloud.pages.directory.shareObject.name = headings[0].outerText;
        //Get index of file in list
        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == cloud.pages.directory.shareObject.name) { // Übereinstimmung
                cloud.pages.directory.shareObject.index = i;
            }
        }

        var path = cloud.pages.directory.pathHistory.last();
        if (path.lastIndexOf("/") != path.length - 1) {
            path = path + "/";
        }

        path = path + cloud.pages.directory.shareObject.name;

        var isDir = cloud.pages.directory.items[cloud.pages.directory.shareObject.index].filetype == "folder";

        cloud.pages.directory.shareObject.path = path;
        cloud.pages.directory.shareObject.isDir = isDir;

        cloud.pages.directory.shareObject.shareTargets = autocomplete.shareTargets;
        cloud.pages.directory.sharePopupUpdateUserList();
        cloud.getShareLink({
            path: cloud.pages.directory.shareObject.path,
            isDir: cloud.pages.directory.shareObject.isDir
        }, cloud.pages.directory.setShareLink,
          function () { cloud.pages.directory.setShareLink({ link: "Not available" }) });
        $('#headerTextShare').text($('#headerTextShare').text() + ": " + cloud.pages.directory.shareObject.name);
        $('#sharePopup').popup();
        $('#sharePopup').popup("open");
    },

    setShareLink: function (obj) {
        console.log("setShareLink");
        $('#shareLinkInput').val(obj.link);
    },

    onDeviceReady: function () {
        document.addEventListener("backbutton", cloud.pages.directory.backButtonClickedEvent, false);
        document.addEventListener("menubutton", cloud.pages.directory.menuButtonClickedEvent, false);
    },

    resetContext: function () {
        cloud.pages.directory.setContext("contextNormal");
    },

    restoreContext: function () {
        var actual = cloud.pages.directory.contextHistory.stack.pop();
        var last = cloud.pages.directory.contextHistory.last();
        cloud.pages.directory.contextHistory.push(actual);
        if (last.indexOf("contextSelection") >= 0) {
            last = "contextSelection";
        }
        cloud.pages.directory.setContext(last);
    },

    setContext: function (newContext) {
        if (!newContext) { newContext = "contextNormal"; }
        if (newContext == "contextNormal") {
            newContext = "contextSelection";
        }
        var actualContext = cloud.pages.directory.contextHistory.last();
        if (newContext == "contextSelection") {
            if (("contextDeletion" + "contextRename" + "contextMovePickTarget").indexOf(actualContext) >= 0) {
                cloud.pages.directory.clearSelection();
            }
        }
        cloud.pages.directory.contextHistory.push(newContext);
        cloud.pages.directory.updateView();
    },

    clearSelection: function () {
        cloud.pages.directory.selectionCounter = 0;
        $("input[type='checkbox']").prop("checked", false).checkboxradio("refresh");
        cloud.pages.directory.updateView();
    },

    updateHeader: function () {
        $('#headerTextDirectory').text(cloud.pages.directory.pathHistory.last());
    },

    refreshBackButton: function () {
        if (cloud.pages.directory.pathHistory.length() > 1) {
            $('#backButton').removeClass('ui-disabled');
        } else {
            $('#backButton').addClass('ui-disabled');
        }
    },

    updateView: function () {
        // Update Selection Context - MUST BE FIRST ENTRY!!!!
        if ("contextSelection" == cloud.pages.directory.contextHistory.last()) {
            //Set exact selection context, to get context sensitive bars a.s.o. later
            var newContext;
            if (cloud.pages.directory.selectionCounter == 1) {
                newContext = "contextSelectionSingle";
            } else if (cloud.pages.directory.selectionCounter > 1) {
                newContext = "contextSelectionMultiple";
            }
            if (newContext) {
                cloud.pages.directory.contextHistory.push(newContext);
            }
        } else {
        }
        //Update View
        $('.context').not('.' + cloud.pages.directory.contextHistory.last()).hide();
        $('.' + cloud.pages.directory.contextHistory.last()).show();
        // Update Menu Buttons
        cloud.pages.directory.refreshBackButton();
        // Update Header
        cloud.pages.directory.updateHeader();
    },

    reloadDirectory: function () {
        // Update content List
        $('body').addClass('ui-loading');

        cloud.getDirectoryContent({
            path: cloud.pages.directory.pathHistory.last(),
            sortBy: cloud.pages.directory.currentSortType
        }, function (directoryContent) {
            cloud.pages.directory.insertElements(directoryContent);

            if (cloud.pages.directory.contextHistory.last().indexOf("contextSelection") >= 0) {
                cloud.pages.directory.selectionCounter = 0;
                cloud.pages.directory.setContext("contextSelection");
            }
            $('body').removeClass('ui-loading');
        }, function () {
            cloud.debug("directory Load failed");
            $('body').removeClass('ui-loading');
        });

    },

    insertElements: function (directoryContent) {
        cloud.pages.directory.items = Array();
        // Überführen der Verzeichnisinhalte in Listview
        for (var i in directoryContent) {
            // Wenn es ein Ordner ist
            if (directoryContent[i].isDir) {
                cloud.pages.directory.items[i] = {
                    title: directoryContent[i].fileName,
                    sizeText: "",
                    path: directoryContent[i].path,
                    filetype: "folder",
                    sizeNum: 0,
                    bNum: directoryContent[i].bNum,
                    picture: cloud.getFileIcon({
                        fileType: "folder"
                    }),
                    date: " - "
                };
            }
                // Andere Dateitypen
            else {
                // Im FileMover keine Dateien anzeigen
                if (cloud.pages.directory.contextHistory.last() !== "contextMovePickTarget") {
                    cloud.pages.directory.items[i] = {
                        title: directoryContent[i].fileName
                                + directoryContent[i].fileType,
                        sizeText: directoryContent[i].bestText,
                        path: directoryContent[i].path,
                        filetype: directoryContent[i].fileType,
                        sizeNum: directoryContent[i].bestNum,
                        bNum: directoryContent[i].bNum,
                        picture: cloud.getFileIcon({
                            fileType: directoryContent[i].fileType
                        }),
                        date: directoryContent[i].date
                    };
                }
            }
        }
        $('#directoryView').empty();

        // Generate ListView
        for (var i in cloud.pages.directory.items) {

            $('#directoryView').append(
                    '<li class="listElement showCheckbox" data-role="fieldcontain" data-filter="true" data-fileName="' + cloud.pages.directory.items[i].title + '">' +
                    '<div class="ui-grid-b">' +
                    '<div class="ui-block-a">' +
                    '<input type="checkbox" id="selectionCheckbox' + i + '" class="selectionCheckbox" data-mini="true" />' +
                    '<label for="selectionCheckbox' + i + '">&nbsp;<label/>' +
                    '</div>' +
                   // '<div class="ui-block-b">' +
                   //' <img class="fileIcon" src="' + cloud.pages.directory.items[i].picture + '" alt="Icon">' +
                    '<div class="ui-block-b" style="background-image:url(\'' + cloud.pages.directory.items[i].picture + '\')">' +
                    '</div>' +
                    '<div class="ui-block-c">' +
                    '<h3>' + cloud.pages.directory.items[i].title + '</h3>' +
                    '<p><strong>' + cloud.pages.directory.items[i].sizeText + '</strong></p>' +
            /*        '<p>Unteruntertitel</p>' +*/
                    '</div>' +
                    '</div>' +
                    '</li>');
            $('#selectionCheckbox' + i).on("change", cloud.pages.directory.selectionCheckboxClickedEvent);
        }
        $('.listElement').on('vclick', cloud.pages.directory.itemClickedEvent);

        $("#directoryView").trigger('create');
        $("#directoryView").listview('refresh');
        $('body').removeClass('ui-loading');
    },

    // Event Handler
    itemClickedEvent: function (event) {
        $('body').addClass('ui-loading');
        event.preventDefault();
        var fileName = event.currentTarget.attributes["data-filename"].textContent;

        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == fileName) {
                // Check if it is a folder
                if (cloud.pages.directory.items[i].filetype == "folder") {
                    // Folder Handling
                    var folderPath = cloud.pages.directory.items[i].path;
                    cloud.pages.directory.pathHistory.push(folderPath);
                    cloud.pages.directory.reloadDirectory();
                    cloud.pages.directory.updateHeader();
                    cloud.pages.directory.updateView();
                } else {
                    // File Handling
                    if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "image") {
                        cloud.pages.directory.openPicturePopup(fileName);
                    } else if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "video") {
                        cloud.pages.directory.openVideoPopup(fileName);
                    } else if (cloud.pages.directory.items[i].filetype == ".pdf") {
                        cloud.pages.directory.openPdfPopup(fileName);
                    } else if (cloud.config.fileTypes[cloud.pages.directory.items[i].filetype] && cloud.config.fileTypes[cloud.pages.directory.items[i].filetype].previewType == "code") {
                        cloud.pages.directory.openTextPopup(fileName);
                    }
                }
                break;
            }
        }
    },

    openPdfPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewPdfDownloadSuccess);
    },

    openVideoPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewVideoDownloadSuccess);
    },

    openPicturePopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewPictureDownloadSuccess);
    },

    openTextPopup: function (fileName) {
        cloud.pages.directory.previewPrepareEvent(fileName, cloud.pages.directory.previewTextDownloadSuccess);
    },

    shareButtonClickedEvent: function (event) {
        cloud.getShareAutocomplete({ key: " " }, cloud.pages.directory.openShareDialog, function () { console.log("Share failed") });
    },

    sharePopupUpdateUserList: function () {
        cloud.getShareStatus({ path: cloud.pages.directory.shareObject.path, isDir: cloud.pages.directory.shareObject.isDir }, cloud.pages.directory.sharePopupSetUserList, function () { console.log("Share failed") });
    },

    sharePopupSetUserList: function (shareStatus) {
        //Todo: Merge performanter machen!
        //Create List of all users with their permissions even if they don't have some
        var allUsers = cloud.pages.directory.shareObject.shareTargets;
        for (e in allUsers) {
            for (i in shareStatus) {
                if (shareStatus[i].shareWith == allUsers[e].shareWith) {
                    allUsers[e] = shareStatus[i];
                }
            }
        }

        $('#shareList').empty();
        for (i in allUsers) {
            var label = allUsers[i].label;
            var shareWith = allUsers[i].shareWith;
            var isUser = allUsers[i].shareToUser;
            var permissionString = "";
            if (allUsers[i].permissionRead) {
                permissionString += "R";
            } if (allUsers[i].permissionWrite) {
                permissionString += "W";
            } if (allUsers[i].permissionDelete) {
                permissionString += "D";
            } if (allUsers[i].permissionReshare) {
                permissionString += "S";
            }
            $('#shareList').append(
                    '<li class="listElement showCheckbox" data-role="fieldcontain" data-isUser="' + isUser + '" data-shareWith="' + shareWith + '">' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-block-a">' +
                    '<input type="checkbox" id="shareElement' + i + '"data-mini="true" />' +
                    '<label for="shareElement' + i + '">&nbsp;<label/>' +
                    '</div>' +
                    '<div class="ui-block-b">' +
                    '<h3>' + shareWith + '</h3>' +
                   '<p><strong>' + permissionString + '</strong></p>' +
            //        '<p>Unteruntertitel</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }
        $("#shareList").trigger('create');
        $("#shareList").listview('refresh');
    },

    sharePopupShareClickedEvent: function (event) {
        cloud.pages.directory.shareObject.successCallback = cloud.pages.directory.shareSuccessEvent;
        cloud.pages.directory.shareObject.errorCallback = cloud.pages.directory.shareErrorEvent;

        var liElements = $('#shareList .ui-icon-checkbox-on').parents('li');

        // Find checked users set permissions for each
        liElements.each(function () {
            var permission = {};
            permission.pRead = document.getElementById('shareReadCheckbox').checked;
            permission.pWrite = document.getElementById('shareWriteCheckbox').checked;
            permission.pCreate = document.getElementById('shareWriteCheckbox').checked; // Create wird genauso wie write-Permission gesetzt
            permission.pDelete = document.getElementById('shareDeleteCheckbox').checked;
            permission.pReshare = document.getElementById('shareReshareCheckbox').checked;
            permission.isUser = this.attributes["data-isUser"].textContent;
            permission.shareWith = this.attributes["data-shareWith"].textContent;
            console.log("Push permission");
            cloud.pages.directory.shareObject.permissionStack.push(permission);
            cloud.unshareObject({
                path: cloud.pages.directory.shareObject.path,
                shareWith: permission.shareWith,
                shareToUser: permission.isUser,
                isDir: cloud.pages.directory.shareObject.isDir
            }, function () {
                //console.log("unshare success");
                cloud.pages.directory.performShare();
            }, function () {
                // console.log("unshare failed");
                cloud.pages.directory.performShare();
            });
        });
    },

    performShare: function () {
        console.log("perform Share");
        var permission = cloud.pages.directory.shareObject.permissionStack.pop();
        cloud.shareObject({
            path: cloud.pages.directory.shareObject.path,
            permissionRead: permission.pRead,
            permissionWrite: permission.pWrite,
            permissionCreate: permission.pCreate,
            permissionDelete: permission.pDelete,
            permissionReshare: permission.pReshare,
            shareWith: permission.shareWith,
            shareToUser: permission.isUser,
            isDir: cloud.pages.directory.shareObject.isDir
        }, cloud.pages.directory.shareObject.successCallback, cloud.pages.directory.shareObject.errorCallback);
    },

    shareSuccessEvent: function () {
        console.log("share success");
        cloud.pages.directory.sharePopupUpdateUserList();
    },

    shareErrorEvent: function () {
        console.log("share failed");
    },

    getSingleSelectedItem: function () {
        var headings = $('#directoryView .ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading');
        cloud.pages.directory.selectedObject = {};
        cloud.pages.directory.selectedObject.name = headings[0].outerText;

        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == cloud.pages.directory.selectedObject.name) { // Übereinstimmung
                cloud.pages.directory.selectedObject.index = i;
                cloud.pages.directory.selectedObject.path = cloud.pages.directory.items[i].path;
                break;
            }
        }
        return cloud.pages.directory.items[i];
    },

    historyButtonClickedEvent: function (event) {
        var elem = cloud.pages.directory.getSingleSelectedItem();
        cloud.getVersions({ path: elem.path }, cloud.pages.directory.openHistoryDialog, function () { console.log("Get Versions failed") });
    },

    openHistoryDialog: function (result) {
        var count = result.length + 1;

        // Aktuelle Version
        $('#historyList').empty();
        $('#historyList').append(
        '<li class="listElement showCheckbox" data-role="fieldcontain" data-versionId="current">' +
        '<div class="ui-grid-a">' +
        '<div class="ui-block-a">' +
        '<input type="checkbox" id="versionElementCurrent" data-mini="true" />' +
        '<label for="versionElementCurrent">&nbsp;<label/>' +
        '</div>' +
        '<div class="ui-block-b">' +
        '<h3>' + cloud.translate("VERSION") + " " + count-- + " (" + cloud.translate("CURRENT") + ")" + '</h3>' +
       '<p><strong>' + "" + '</strong></p>' +
//        '<p>Unteruntertitel</p>' +
        '</div>' +
        '</div>' +
        '</li>');

        for (i in result) {
            var version = result[i];
            version.title = cloud.translate("VERSION") + " " + count--;

            $('#historyList').append(
                    '<li class="listElement showCheckbox" data-role="fieldcontain" data-versionId="' + version.versionId + '">' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-block-a">' +
                    '<input type="checkbox" id="versionElement' + i + '"data-mini="true" />' +
                    '<label for="versionElement' + i + '">&nbsp;<label/>' +
                    '</div>' +
                    '<div class="ui-block-b">' +
                    '<h3>' + version.title + '</h3>' +
                   '<p><strong>' + version.date + '</strong></p>' +
            //        '<p>Unteruntertitel</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }

        $("#historyList").trigger('create');
        $("#historyList").listview('refresh');

        $('#historyPopup').popup();
        $('#historyPopup').popup("open");
    },

    restoreVersion: function () {
        console.log("perform version restore");

        // close popup
        $('#historyPopup').popup("close");

        // Find first checked version checkbox
        var liElement = $('#historyList .ui-icon-checkbox-on').parents('li').first();

        if ($(liElement).size() > 0) {
            var versionId = $(liElement).attr('data-versionId');
            if (versionId !== "current") {
                cloud.restoreVersion({
                    path: cloud.pages.directory.selectedObject.path,
                    versionId: $(liElement).attr('data-versionId')
                }, cloud.pages.directory.restoreVersionSuccess, cloud.pages.directory.restoreVersionError);
                return;
            }
        }
        // Else
        cloud.pages.directory.restoreVersionError();
    },

    restoreVersionSuccess: function () {
        console.log("version restore successful");
    },

    restoreVersionError: function () {
        console.log("version restore error");
    },

    restoreButtonClickedEvent: function (event) {
        $('#menuPopup').popup("close");

        cloud.getDirectoryContent({
            path: cloud.pages.directory.pathHistory.last(),
            sortBy: cloud.pages.directory.currentSortType,
            deletedFiles: "onlyDeleted"
        },
        cloud.pages.directory.openRestoreDialog,
        function () {
            cloud.debug("Get deleted files failed");
        });
    },

    openRestoreDialog: function (result) {
        var count = result.length + 1;

        // Aktuelle Version
        $('#restoreList').empty();

        for (i in result) {
            var file = result[i];

            $('#restoreList').append(
                    '<li class="listElement showCheckbox" data-role="fieldcontain" data-deletedId="' + file.deletedId + '" ' +
                    'data-restorePath="' + file.path + '">' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-block-a">' +
                    '<input type="checkbox" id="restoreElement' + i + '"data-mini="true" />' +
                    '<label for="restoreElement' + i + '">&nbsp;<label/>' +
                    '</div>' +
                    '<div class="ui-block-b">' +
                    '<h3>' + file.fileName + '</h3>' +
                   '<p><strong>' + file.date + '</strong></p>' +
            //        '<p>Unteruntertitel</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }

        //cloud.pages.directory.deletedFiles = result; // Alle gelöschten Dateien im cloud-Objekt speichern

        $("#restoreList").trigger('create');
        $("#restoreList").listview('refresh');

        $('#restorePopup').popup();
        $('#restorePopup').popup("open");
    },

    restoreFile: function () {
        console.log("perform file restore");

        // close popup
        $('#restorePopup').popup("close");

        // Find first checked version checkbox
        var liElement = $('#restoreList .ui-icon-checkbox-on').parents('li');

        if ($(liElement).size() > 0) {
            $(liElement).each(function () {
                cloud.restoreFile({
                    path: $(this).attr('data-restorePath'),
                    deletedId: $(this).attr('data-deletedId')
                }, cloud.pages.directory.restoreFileSuccess, cloud.pages.directory.restoreFileError);
            });
        } else {
            cloud.pages.directory.restoreFileError();
        }
    },

    restoreFileSuccess: function () {
        cloud.pages.directory.reloadDirectory();
        console.log("file restore successful");
    },

    restoreFileError: function () {
        console.log("file restore error");
    },

    selectionButtonClickedEvent: function (event) {
        if (cloud.pages.directory.contextHistory.last() == "contextSelection") {
            cloud.pages.directory.setContext("contextNormal");
        }
        else if (cloud.pages.directory.contextHistory.last() == "contextNormal") {
            cloud.pages.directory.setContext("contextSelection");
        }

    },
    selectionCheckboxClickedEvent: function (event) {
        if (event.currentTarget.checked) {
            cloud.pages.directory.selectionCounter = cloud.pages.directory.selectionCounter + 1;
        } else {
            cloud.pages.directory.selectionCounter = cloud.pages.directory.selectionCounter - 1;
        }
        cloud.pages.directory.setContext('contextSelection');
    },

    logoutButtonClickedEvent: function (event) {
        cloud.setLoggedIn({ loginStatus: false });
        cloud.storage.deleteItem(login.saveLoginKey);
        $.mobile.changePage("#loginPage", { transition: "slide" });
    },

    backButtonClickedEvent: function (event) {
        $('body').removeClass('ui-loading');
        console.log("backButtonClickedEvent");
        if (cloud.pages.directory.pathHistory.last() != "/") {
            cloud.pages.directory.pathHistory.pop();
        }
        cloud.pages.directory.reloadDirectory();
    },

    menuButtonClickedEvent: function (event) {
        $("#menuPopup").popup("open", { positionTo: "#menuButton", transition: "pop" });
    },

    movePrepareEvent: function () {
        // Remember selection
        for (var i in cloud.pages.directory.items) {
            $('.ui-icon-checkbox-on').each(function () {
                if (cloud.pages.directory.items[i].title == $(this).parents('#directoryView li').find('.ui-li-heading').text()) { // Übereinstimmung
                    // Src-Daten festhalten
                    cloud.pages.directory.moveSrc.push({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });
                }
            });
        }

        cloud.pages.directory.setContext("contextMovePickTarget");
        cloud.pages.directory.reloadDirectory();
    },

    moveElement: function (event) {
        if (cloud.pages.directory.contextHistory.last() == "contextMovePickTarget" && cloud.pages.directory.moveSrc.length > 0) {
            for (i in cloud.pages.directory.moveSrc) {

                var src = cloud.pages.directory.moveSrc.pop();
                // Get file name
                var splitPath = apphelper.convertPath({
                    path: src.path,
                    isDir: src.isDir
                });

                var targetPath;

                if (cloud.pages.directory.pathHistory.last() == "/") {
                    targetPath = cloud.pages.directory.pathHistory.last() + splitPath.fileFullName;
                } else {
                    targetPath = cloud.pages.directory.pathHistory.last() + "/" + splitPath.fileFullName;
                }
                console.log("Move it from: " + src.path + " to: " + targetPath);
                cloud.moveObject({
                    srcPath: src.path,
                    targetPath: targetPath,
                    isDir: src.isDir
                }, cloud.pages.directory.moveElementSuccess, cloud.pages.directory.moveElementError);
            }
        }

        // Kontext zurücksetzen
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
    },

    moveElementSuccess: function (event) {
        console.log("Moving successful");
    },

    moveElementError: function (event) {
        console.log("Error while moving");
    },

    deletePrepareEvent: function () {
        for (var e in $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading')) {
            var fileName = $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading')[e].outerText;

            // Find correct element in list and remember selection
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    // Get file name
                    var splitPath = apphelper.convertPath({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });

                    cloud.pages.directory.deleteSrc.push({
                        path: cloud.pages.directory.items[i].path,
                        name: splitPath.fileFullName,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });
                    break;
                }
            }
        }
        // Etwas umständlich, aber sonst Buttontitel nicht lokalisiert
        var buttons = {};
        buttons[cloud.translate('CONFIRMDELETEBUTTON')] = {
            'click': cloud.pages.directory.deleteFile
        }
        buttons[cloud.translate('CANCEL')] = {
            'click': cloud.pages.directory.resetSilent,
            icon: "delete"
        }

        // Delete confirmation dialog
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: cloud.translate('DELETE'),
            headerClose: false,
            buttonPrompt: cloud.translate('CONFIRMDELETETEXTMULTI'),
            buttonInput: false,
            buttons: buttons
        });
    },

    deleteFile: function () {
        while (!cloud.pages.directory.deleteSrc.isEmpty()) {
            var src = cloud.pages.directory.deleteSrc.pop();
            console.log("Delete: " + src.path);

            cloud.deleteObject({
                path: src.path
            },
                function () { /*success*/
                    console.log("Delete successful");
                },
                function () {
                    console.log("Error while deletion");
                }
            );
        }
        // Handle UI
        $(document).trigger('simpledialog', { 'method': 'close' });

        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
    },

    renamePrepareEvent: function () {
        if ($('.ui-icon-checkbox-on').size() > 1) {
            // Too many items selected
            $('<div>').simpledialog2({
                mode: 'button',
                headerText: cloud.translate('RENAME'),
                headerClose: true,
                buttonPrompt: cloud.translate('RENAMEFORBIDDEN'),
                buttonInput: false,
                buttons: {
                    'OK': {
                        'click': cloud.pages.directory.resetSilent
                    }
                }
            }).focus();

            // Kontext zurücksetzen
            cloud.pages.directory.setContext("contextNormal");

            return;
        } else if ($('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading').size() == 1) {
            var fileName = $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading').text();

            // Remember selection
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    // Get file name
                    var splitPath = apphelper.convertPath({
                        path: cloud.pages.directory.items[i].path,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });

                    cloud.pages.directory.renameSrc.push({
                        path: cloud.pages.directory.items[i].path,
                        name: splitPath.fileFullName,
                        isDir: cloud.pages.directory.items[i].filetype == "folder"
                    });

                    // Etwas umständlich, aber sonst Buttontitel nicht lokalisiert
                    var buttons = {
                        'OK': {
                            'click': cloud.pages.directory.renameFile
                        }
                    };
                    buttons[cloud.translate('CANCEL')] = {
                        'click': cloud.pages.directory.resetSilent,
                        icon: "delete"
                    }

                    // Rename dialog
                    $('<div>').simpledialog2({
                        mode: 'button',
                        headerText: cloud.translate('CONFIRMRENAME'),
                        headerClose: false,
                        buttonPrompt: cloud.translate('RENAMEPOPUP') + '"' + cloud.pages.directory.renameSrc[0].name + '"',
                        buttonInput: true,
                        buttons: buttons
                    });

                    break; // rest nicht mehr durchgehen, da nur einzelne elemente umbenannt werden dürfen
                }
            }
        }

        // Kontext zurücksetzen
        cloud.pages.directory.setContext("contextRenamePickName");
    },

    renameFile: function () {
        console.log("New Name:" + $.mobile.sdLastInput);

        var src = cloud.pages.directory.renameSrc.pop();
        cloud.renameObject({
            srcPath: src.path,
            targetName: $.mobile.sdLastInput,
            isDir: src.isDir
        },
            function () { /*success*/
                console.log("Renaming successful");
                cloud.pages.directory.setContext("contextNormal"); // reload directory
            },
            function () {
                console.log("Error while renaming");
            }
        );

        // Handle UI
        $(document).trigger('simpledialog', { 'method': 'close' });
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.setContext("contextNormal");
        cloud.pages.directory.clearSelection();
        cloud.pages.directory.reloadDirectory();
    },

    resetSilent: function () {
        $(document).trigger('simpledialog', { 'method': 'close' });
        cloud.pages.directory.setContext("contextNormal");
    },

    createFolderPrepareEvent: function () {
        // Etwas umständlich, aber sonst Buttontitel nicht lokalisiert
        var buttons = { 'OK': { 'click': cloud.pages.directory.createFolder } };
        buttons[cloud.translate('CANCEL')] = { 'click': cloud.pages.directory.resetSilent, icon: "delete" }

        // Create dialog
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: cloud.translate('CREATEFOLDER'),
            headerClose: false,
            buttonPrompt: cloud.translate('CREATEFOLDERTEXT'),
            buttonInput: true,
            buttons: buttons
        });

        // Kontext zurücksetzen
        cloud.pages.directory.setContext("contextCreatePickName");
    },

    createFolder: function () {
        console.log("New Folder:" + $.mobile.sdLastInput);

        var targetPath;
        if (cloud.pages.directory.pathHistory.last() == "/") {
            targetPath = cloud.pages.directory.pathHistory.last();
        } else {
            targetPath = cloud.pages.directory.pathHistory.last() + "/";
        }

        cloud.createFolder({
            path: targetPath,
            folderName: $.mobile.sdLastInput
        },
            function () { /*success*/
                console.log("Folder creation successful");
                cloud.pages.directory.restoreContext();
                cloud.pages.directory.reloadDirectory();
            },
            function () {
                console.log("Error while creating folder");
            }
        );

        // Handle UI
        $(document).trigger('simpledialog', { 'method': 'close' });
    },

    capturePicture: function () {
        navigator.device.capture.captureImage(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError);
    },
    captureVideo: function () {
        navigator.device.capture.captureVideo(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError);
    },

    captureAudio: function () {
        navigator.device.capture.captureAudio(cloud.pages.directory.captureSuccess, cloud.pages.directory.captureError);
    },
    camera: function () {
        navigator.camera.getPicture(cloud.pages.directory.cameraSuccess, cloud.pages.directory.cameraError, { quality: 49, destinationType: Camera.DestinationType.DATA_URL });
    },

    cameraSuccess: function (imageData) {
        console.log("cameraSuccess: " + imageData);
        cloud.uploadFile({ targetPath: cloud.pages.directory.pathHistory.last() }, camera.pages.directory.uploadSucceed, camera.pages.directory.uploadError, { uri: imageData });
    },

    cameraError: function (message) {
        console.log("cameraError: " + message);
    },

    uploadSucceed: function (r) {
        console.log("upload Succeed" + r);
        cloud.pages.directory.reloadDirectory();
    },

    uploadError: function (error) {
        console.log("uploadError: " + error);
    },


    previewPrepareEvent: function (fileName, successFunction) {
        for (var i in cloud.pages.directory.items) {
            if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                var param = [];
                param[0] = apphelper.convertPath({ path: cloud.pages.directory.items[i].path });
                cloud.downloadFile(param, successFunction, cloud.functions.downloadError, null);
                break;
            }
        }
    },

    previewPdfDownloadSuccess: function (blob, filename) {
        blob.type = 'application/pdf';
        if (device.platform = "iOS") {
            window.open(window.webkitURL.createObjectURL(blob), '_blank', 'location=yes');
        } else {
            window.open(window.webkitURL.createObjectURL(blob), '_system', 'location=yes');
            //navigator.load.url(window.webkitURL.createObjectURL(blob))
            //$('#objectSource')[0].data = window.webkitURL.createObjectURL(blob);
            //$('#objectPopup').popup();
            //$('#objectPopup').popup("open");
        }
        $('body').removeClass('ui-loading');
    },

    previewTextDownloadSuccess: function (blob, filename) {
        blob.type = 'text/txt';
        if (device.platform = "iOS") {
            window.open(window.webkitURL.createObjectURL(blob), '_blank', 'location=yes');
        } else {

            $('#objectSource')[0].data = window.webkitURL.createObjectURL(blob);
            $('#objectPopup').popup();
            $('#objectPopup').popup("open");
        }
        $('body').removeClass('ui-loading');
    },

    previewVideoDownloadSuccess: function (blob, filename) {
        blob.type = 'video/mp4';
        if (device.platform = "iOS") {
            window.open(window.webkitURL.createObjectURL(blob), '_blank', 'location=yes');
        } else {
            window.open(window.webkitURL.createObjectURL(blob), '_blank', 'location=yes');
            //navigator.load.url(window.webkitURL.createObjectURL(blob))
            //$('#objectSource')[0].data = window.webkitURL.createObjectURL(blob);
            //$('#objectPopup').popup();
            //$('#objectPopup').popup("open");
        }
        $('body').removeClass('ui-loading');
    },

    previewPictureDownloadSuccess: function (blob, filename) {
        $('#imagePopupImg')[0].src = window.webkitURL.createObjectURL(blob);
        $('#imagePopup').popup();
        $('#imagePopup').popup("open");
        //window.open(window.webkitURL.createObjectURL(blob), '_blank', 'location=yes');
        $('body').removeClass('ui-loading');
    },

    downloadPrepareEvent: function () {
        var headings = $('.ui-icon-checkbox-on').parents('#directoryView li').find('.ui-li-heading');
        for (h in headings) {
            var fileName = headings[h].outerText;
            for (var i in cloud.pages.directory.items) {
                if (cloud.pages.directory.items[i].title == fileName) { // Übereinstimmung
                    var param = [];
                    param[0] = apphelper.convertPath({ path: cloud.pages.directory.items[i].path });
                    cloud.downloadFile(param, cloud.functions.downloadSuccess, cloud.functions.downloadError, null);
                    break;
                }
            }
        }
    },

    fileSystemReadSucceed: function (fileEntry) {
        console.log("Datei aufgenommen: " + fileEntry.fullPath);
        cloud.uploadFile({ targetPath: cloud.pages.directory.pathHistory.last() }, cloud.pages.directory.uploadSucceed, cloud.pages.directory.uploadError, fileEntry);
    },

    captureSuccess: function (mediaFiles) {
        var i, path, len;
        console.log("captureSuccess");
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function () { window.resolveLocalFileSystemURI(path, cloud.pages.directory.fileSystemReadSucceed, cloud.pages.directory.filesystemReadError) }, cloud.pages.directory.filesystemError);
        }
    },

    fileSystemReadError: function (evt) {
        console.log("FileSystemErrror: " + evt.target.error.code);
    },

    captureError: function (error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    }
}
