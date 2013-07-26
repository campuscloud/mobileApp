//Konfigurationsdaten (Frontend-unabhängig!)
var appconfig = {
    // Standardsprache festlegen
    "standardLanguage": "en-us",

    // Vorkonfigurierte Serveradressen (über "name" identifiziert)
    "servers": {
        "uni-muenster-oc": {
            "type": "owncloud",
            "name": "uni-muenster-oc",
            "host": "http://pscloud.uni-muenster.de/owncloud",
            "port": "80",
            "title": "Universität Münster ownCloud",
            "description": "ownCloud Instanz der Universität Münster",
            "iconPath": "images/homeListIcons/uni_muenster.jpg",
            "langKey": "SERVERMUENSTER",
            "langKeyDesc": "SERVERDESCRIPTIONMUENSTER",
            "order": 0
        },

        "uni-muenster-sp": { // Sharepoint
            "type": "sharepoint", 
            "name": "uni-muenster-sp",
            "host": "https://pscloudservices.sharepoint.com",
            "port": "",
            "title": "Universität Münster Sharepoint",
            "description": "Sharepoint Instanz der Universität Münster",
            "iconPath": "images/homeListIcons/muenster_bnw.jpg",
            "langKey": "SERVERSHAREPOINT",
            "langKeyDesc": "SERVERDESCRIPTIONSHAREPOINT",
            "order": 1
        },
    },

    // Debug-Modus
    "debug": true,

    // Style der Icons: "white" oder "black"
    "theme": "green",

    // Dateitypen
    "fileTypesThemeRoot": "images/fileIcons/",
    "fileTypes": {
        "folder": {
            "icon": "folder.svg"
        },
        ".pdf": {
            "icon": "pdf.svg",
            "previewType": "reader",
        },
        /*".xps": {
            "icon": "xps.svg",
        },
        ".oxps": {
            "icon": "oxps.svg",
        },*/
        ".cbz": {
            "icon": "pdf.svg",
            "previewType": "reader",
        },
        ".ppt": {
            "icon": "ppt.svg"
        },
        ".pptx": {
            /*"icon": "pptx.svg"*/
            "icon": "ppt.svg"
        },
        ".keynote": {
            "icon": "ppt.svg"
        },
        ".png": {
            "icon": "image.svg",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".jpeg": {
            "icon": "image.svg",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".jpg": {
            "icon": "image.svg",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".gif": {
            "icon": "gif.svg",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".bmp": {
            "icon": "image.svg",
            "previewType": "image",
            "hasFileeeSupport": true
        },
        ".txt": {
            "icon": "word.svg",
            "previewType": "code",
        },
       /* ".log": {
            "icon": "log.svg",
            "previewType": "code",
        },*/
        ".svg": {
            "icon": "image.svg",
            "previewType": "image"
        },
        ".psd": {
            "icon": "image.svg"
        },
        ".xlsx": {
            "icon": "excel.svg"
        },
        ".xls": {
            "icon": "excel.svg"
        },
        ".doc": {
            "icon": "word.svg"
        },
        ".docx": {
            "icon": "word.svg",
            "previewType": "word",
        },
        ".vsd": {
            "icon": "visio.svg"
        },
        ".mp3": {
            "icon": "music.svg",
            "previewType": "audio",
        },
        ".m4a": {
            "icon": "music.svg"
        },
        ".wma": {
            "icon": "music.svg"
        },
        ".rar": {
            "icon": "compressed_2.svg"
        },
        ".zip": {
            "icon": "compressed_2.svg"
        },
        ".7z": {
            "icon": "compressed_2.svg"
        },
        ".gz": {
            "icon": "compressed_2.svg"
        },
        ".tar": {
            "icon": "compressed_2.svg"
        },
        ".java": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-java",
        },
        ".c": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-csrc",
        },
        ".cpp": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-c++src",
        },
        ".c#": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-csharp",
        },
        ".css": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/css",
        },
        ".diff": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-diff",
        },
        ".diff": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-diff",
        },
        ".hs": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-haskell",
        },
        ".html": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/html",
        },
        ".js": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/javascript",
        },
        ".lua": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-lua",
        },
        ".p": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-pascal",
        },
        ".perl": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-perl",
        },
        ".php": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-php",
        },
        ".py": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-python",
        },
        ".r": { //Copy Right
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-rsrc",
        },
        ".rb": { //Copy Right
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-ruby",
        },
        ".s": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-scheme",
        },
        ".sql": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-sql",
        },
        ".stex": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-stex",
        },
        ".tex": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-stex",
        },
        ".vb": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/x-vb",
        },
        ".vba": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".vbe": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".vbs": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "text/vbscript",
        },
        ".xml": {
            "icon": "code.svg",
            "previewType": "code",
            "codeType": "application/xml",
        },
        ".mp4": {
            "icon": "video.svg",
            "previewType": "video",
        },
        ".wmv": {
            "icon": "video.svg",
            "previewType": "video",
        },
        ".m4v": {
            "icon": "video.svg",
            "previewType": "video",
        },
        ".webm": {
            "icon": "video.svg",
            "previewType": "video",
        },
        ".mpeg": {
            "icon": "video.svg",
        },
        ".ogg": {
            "icon": "video.svg",
        },
        ".mov": {
            "icon": "video.svg",
        },
        ".flv": {
            "icon": "video.svg",
        },
        ".mkv": {
            "icon": "video.svg",
        },
        ".avi": {
            "icon": "video.svg",
        },
        ".eml": {
            "icon": "mail.svg"
        },
        ".msg": {
            "icon": "mail.svg"
        },
        ".benni": {
            "icon": "benni.svg"
        },
        ".christoph": {
            "icon": "christoph.svg"
        },
        ".simon": {
            "icon": "simon.svg"
        },
        ".jannik": {
            "icon": "jannik.svg"
        },
        ".patrick": {
            "icon": "patrick.svg"
        },
        ".arne": {
            "icon": "arne.svg"
        },
        ".david": {
            "icon": "david.svg"
        },
        ".tassilo": {
            "icon": "tassilo.svg"
        },
        " ": {
            "icon": "unknown.svg"
        },
        "": {
        }
    },

    // Tastaturbedienung (für alle Aktionen, die nativ nicht gegeben sind)
    "keyboardContexts": {
        // Spezielle Tastaturbefehle, die ÜBERALL möglich sind (kann nicht abgeschaltet werden)
        // Sehr vorsichtig nur verwenden, z.B. für Flyouts
        "superglobal":
            [{
                "key": "H",
                "altKey": true,
                "action": "showHelpSettings",
                "type": "superglobal",
                "descriptionKey": "HELP",
                "addClickhandler": true,
                "clickhandlerElement": "#helpButton"
            }],
        // Spezielle Tastaturbefehle, die global gelten, aber in einzelnen Kontexten wie Dialogen
        // deaktiviert werden können. Empfohlen für allgemein verfügbare Funktionen (z.B. Navigationsbar)
        "global":
            [
            {
                "key": "2",
                "action": "account",
                "type": "global",
                "altKey": true,
                "descriptionKey": "ACCOUNT",
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonAccount"
            },
            {
                "key": "3",
                "action": "logout",
                "type": "global",
                "altKey": true,
                "descriptionKey": "LOGOUT",
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonLogout"
            },
            ],

        // alle normalen Kontexte sind hier als Array von Tastaturaktionen definiert, z.B. "login",...
        // zu beachten: Bennis neue implementierung mit mehreren Kontexten, in denen die seite geladen ist
        // außerdem sind wechselnde appbar-zustände jeweils neue kontexte (sonst wird die funktion trotz ausblendung ausgeführt)
        /*{ // Beispiel eines Befehls mit allen möglichen parametern, siehe zur Erklärung auch frontendInterface
                "key": "B",
                "action": "irgendwas",
                "type": "normal",
                "ctrlKey": true,
                "altKey": false,
                "shiftKey": true,
                "mode": "keydown",
                "descriptionKey": "SOMETHING",
                "target": "#textfield",
                "delegate": ".subelements",
                "addClickhandler": true,
                "clickhandlerElement": "#buttonid"
            } */
        "login":
            [{
                "key": "Enter",
                "action": "doLogin",
                "descriptionKey": "LOGIN",
                "addClickhandler": true,
                "clickhandlerElement": "#loginButton"
            }],
        "directoryStart":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            //KEINE AUSWAHL
            {
                "key": "Esc",
                "ctrlKey": false,
                "action": "clearSelection",
                "addClickhandler": true,
                "clickhandlerElement": "#clearSelectionButton",
                "descriptionKey": "CLEARSELECTION"
            },
            {
                "key": "E",
                "ctrlKey": true,
                "action": "refresh",
                "addClickhandler": true,
                "clickhandlerElement": "#syncButton",
                "descriptionKey": "REFRESH"
            },
            {
                "key": "N",
                "ctrlKey": true,
                "action": "sortByName",
                "addClickhandler": true,
                "clickhandlerElement": "#sortByName",
                "descriptionKey": "SORTBYNAME"
            },
            {
                "key": "S",
                "ctrlKey": true,
                "action": "sortBySizeDesc",
                "addClickhandler": true,
                "clickhandlerElement": "#sortBySize",
                "descriptionKey": "SORTBYSIZE"
            },
            {
                "key": "U",
                "ctrlKey": true,
                "action": "displayDeleted",
                "addClickhandler": true,
                "clickhandlerElement": "#showDeletedButton",
                "descriptionKey": "SHOWDELETED"
            },
            {
                "key": "Entf",
                "ctrlKey": true,
                "action": "restoreFile",
                "addClickhandler": true,
                "clickhandlerElement": "#restoreFileButton",
                "descriptionKey": "HELPRESTOREFILE"
            },
            {
                "key": "H",
                "ctrlKey": true,
                "altKey": true,
                "action": "showHistory",
                "addClickhandler": true,
                "clickhandlerElement": "#historyButton",
                "descriptionKey": "HISTORY"
            },
            {
                "key": "C",
                "altKey": true,
                "action": "cameraUpload",
                "addClickhandler": true,
                "clickhandlerElement": "#cameraButton",
                "descriptionKey": "TAKEPHOTOORVIDEO"
            },
            {
                "key": "U",
                "altKey": true,
                "action": "upload",
                "addClickhandler": true,
                "clickhandlerElement": "#uploadButton",
                "descriptionKey": "UPLOAD"
            },
            {
                "key": "F",
                "ctrlKey": true,
                "action": "createFolder",
                "descriptionKey": "CREATEFOLDER"
            },
            //IMMER BEI AUSWAHL
            {
                "key": "Entf",
                "action": "deleteFileButtonEvent",
                "descriptionKey": "DELETE"
            },
            {
                "key": "C",
                "ctrlKey": true,
                "action": "moveObject",
                "addClickhandler": true,
                "clickhandlerElement": "#moveFileButton",
                "descriptionKey": "MOVE"
            },
            //1 AUSGEWÄHLTES ELEMENT
            {
                "key": "O",
                "ctrlKey": true,
                "action": "openFile",
                "addClickhandler": true,
                "clickhandlerElement": "#openButton",
                "descriptionKey": "OPEN"
            },
            {
                "key": "D",
                "ctrlKey": true,
                "action": "download",
                "addClickhandler": true,
                "clickhandlerElement": "#downloadButton",
                "descriptionKey": "DOWNLOAD"
            },
            {
                "key": "R",
                "ctrlKey": true,
                "action": "rename",
                "descriptionKey": "RENAME"
            },
            //1 "DATEI" AUSGEWÄHLT
            {
                "key": "H",
                "ctrlKey": true,
                "action": "share",
                "addClickhandler": true,
                "clickhandlerElement": "#shareButtonAppbar",
                "descriptionKey": "SHARE"
            },
            {
                "key": "I",
                "altKey": true,
                "action": "showFileInfo",
                "descriptionKey": "FILEINFO"
            }
                //SelectAll? Strg+A
                //...
            ],
        "directoryRename":
            [/*{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Enter",
                "action": "renameConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#renameButton",
                "descriptionKey": "CONFIRMRENAME"
            }*/],
        "directoryDelete":
            [/*{
                "key": "Enter",
                "action": "deleteConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#confirmDeleteButton",
                "descriptionKey": "CONFIRMDELETEBUTTON"
            }*/],
        "directoryCreateFolder":
            [/*{
                "key": "Enter",
                "action": "folderCreateConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#createFolder",
                "descriptionKey": "CREATEFOLDER"
            }*/],
        "directoryShareLink":
            [/*{
                "key": "Enter",
                "action": "shareConfirm",
                "addClickhandler": true,
                "clickhandlerElement": "#sendShareLink",
                "descriptionKey": "SENDSHARELINK"
            }*/],
        "fileMover":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            {
                "key": "V",
                "ctrlKey": true,
                "action": "paste",
                "addClickhandler": true,
                "clickhandlerElement": "#pasteFileButton",
                "descriptionKey": "PASTE"
            },
            {
                "key": "Esc",
                "action": "cancel",
                "addClickhandler": true,
                "clickhandlerElement": "#cancelButton",
                "descriptionKey": "CANCEL"
            }],
        "shareTarget":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            {
                "key": "U",
                "altKey": true,
                "action": "upload",
                "addClickhandler": true,
                "clickhandlerElement": "#uploadButton",
                "descriptionKey": "UPLOAD"
            }],
        "savePicker":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            }],
        "openPicker":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            }],
        "pdf":
            [{
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "Back",
                "action": "navigateBack",
                "descriptionKey": "BACK",
                "addClickhandler": true,
                "clickhandlerElement": "#backButton",
                "descriptionKey": "HELPBACK"
            },
            {
                "key": "Back",
                "shiftKey": true,
                "action": "navigateForward",
                "descriptionKey": "FORWARD",
                "addClickhandler": true,
                "clickhandlerElement": "#forwardButton",
                "descriptionKey": "HELPFORWARD"
            },
            //PDF spezifisch
            {
                "key": "ArrowRight",
                "action": "next",
                "descriptionKey": "PDFNEXT",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfNextButton",
                "descriptionKey": "PDFNEXT"
            },
            {
                "key": "ArrowLeft",
                "action": "back",
                "descriptionKey": "PDFBACK",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfBackButton",
                "descriptionKey": "PDFBACK"
            },
            { //TODO: Nummernpad + geht nicht
                "key": "Plus",
                "action": "zoomIn",
                "descriptionKey": "ZOOMIN",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfZoomInButton",
                "descriptionKey": "ZOOMIN"
            },
            { //TODO: Nummernpad - geht nicht
                "key": "Minus",
                "action": "zoomOut",
                "descriptionKey": "ZOOMOUT",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfZoomOutButton",
                "descriptionKey": "ZOOMOUT"
            },
            {
                "key": "Enter",
                "ctrlKey": true,
                "action": "pageBtn",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfGoToPageButton",
                "descriptionKey": "GOTOPAGE"
            },
            //KEINE AUSWAHL
            {
                "key": "Esc",
                "ctrlKey": false,
                "action": "clearSelection",
                "addClickhandler": true,
                "clickhandlerElement": "#clearSelectionButton",
                "descriptionKey": "CLEARSELECTION"
            },
            {
                "key": "E",
                "ctrlKey": true,
                "action": "refresh",
                "addClickhandler": true,
                "clickhandlerElement": "#refreshButton",
                "descriptionKey": "REFRESH"
            },
            {
                "key": "N",
                "ctrlKey": true,
                "action": "sortByName",
                "addClickhandler": true,
                "clickhandlerElement": "#sortByName",
                "descriptionKey": "SORTBYNAME"
            },
            {
                "key": "S",
                "ctrlKey": true,
                "action": "sortBySizeDesc",
                "addClickhandler": true,
                "clickhandlerElement": "#sortBySize",
                "descriptionKey": "SORTBYSIZE"
            },
            {
                "key": "U",
                "ctrlKey": true,
                "action": "displayDeleted",
                "addClickhandler": true,
                "clickhandlerElement": "#showDeletedButton",
                "descriptionKey": "SHOWDELETED"
            },
            {
                "key": "Entf",
                "ctrlKey": true,
                "action": "restoreFile",
                "addClickhandler": true,
                "clickhandlerElement": "#restoreFileButton",
                "descriptionKey": "HELPRESTOREFILE"
            },
            {
                "key": "H",
                "ctrlKey": true,
                "action": "showHistory",
                "addClickhandler": true,
                "clickhandlerElement": "#historyButton",
                "descriptionKey": "HISTORY"
            },
            {
                "key": "C",
                "altKey": true,
                "action": "cameraUpload",
                "addClickhandler": true,
                "clickhandlerElement": "#cameraButton",
                "descriptionKey": "TAKEPHOTOORVIDEO"
            },
            {
                "key": "U",
                "altKey": true,
                "action": "upload",
                "addClickhandler": true,
                "clickhandlerElement": "#uploadButton",
                "descriptionKey": "UPLOAD"
            },
            {
                "key": "F",
                "ctrlKey": true,
                "action": "createFolder",
                "descriptionKey": "CREATEFOLDER"
            },
            //IMMER BEI AUSWAHL
            {
                "key": "Entf",
                "action": "deleteFileButtonEvent",
                "descriptionKey": "DELETE"
            },
            {
                "key": "M",
                "ctrlKey": true,
                "action": "moveObject",
                "addClickhandler": true,
                "clickhandlerElement": "#moveFileButton",
                "descriptionKey": "MOVE"
            },
            //1 AUSGEWÄHLTES ELEMENT
            {
                "key": "O",
                "ctrlKey": true,
                "action": "openFile",
                "addClickhandler": true,
                "clickhandlerElement": "#openButton",
                "descriptionKey": "OPEN"
            },
            {
                "key": "D",
                "ctrlKey": true,
                "action": "download",
                "addClickhandler": true,
                "clickhandlerElement": "#downloadButton",
                "descriptionKey": "DOWNLOAD"
            },
            {
                "key": "R",
                "ctrlKey": true,
                "action": "rename",
                "descriptionKey": "RENAME"
            },
            //1 "DATEI" AUSGEWÄHLT
            {
                "key": "H",
                "ctrlKey": true,
                "action": "share",
                "addClickhandler": true,
                "clickhandlerElement": "#shareButtonAppbar",
                "descriptionKey": "SHARE"
            },
            {
                "key": "I",
                "altKey": true,
                "action": "showFileInfo",
                "descriptionKey": "FILEINFO"
            }],
        "pdfPageNum":
            [//PDF spezifisch
            {
                "key": "1",
                "action": "home",
                "altKey": true,
                "addClickhandler": true,
                "clickhandlerElement": "#navButtonHome",
                "descriptionKey": "HOME"
            },
            {
                "key": "ArrowRight",
                "ctrlKey": true,
                "action": "next",
                "descriptionKey": "PDFNEXT",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfNextButton",
                "descriptionKey": "PDFNEXT"
            },
            {
                "key": "ArrowLeft",
                "ctrlKey": true,
                "action": "back",
                "descriptionKey": "PDFBACK",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfBackButton",
                "descriptionKey": "PDFBACK"
            },
            {
                "key": "Plus",
                "ctrlKey": true,
                "action": "zoomIn",
                "descriptionKey": "ZOOMIN",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfZoomInButton",
                "descriptionKey": "ZOOMIN"
            },
            {
                "key": "Minus",
                "ctrlKey": true,
                "action": "zoomOut",
                "descriptionKey": "ZOOMOUT",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfZoomOutButton",
                "descriptionKey": "ZOOMOUT"
            },
            {
                "key": "Enter",
                "ctrlKey": true,
                "action": "pageBtn",
                "descriptionKey": "GOTOPAGE",
                "addClickhandler": true,
                "clickhandlerElement": "#pdfGoToPageButton",
                "descriptionKey": "GOTOPAGE"
            },
            //Bei einem ausgewählten Element
            {
                "key": "Entf",
                "action": "deleteFileButtonEvent",
                "descriptionKey": "DELETE"
            }, ],
        "directoryHistory":
            [{
                "key": "Enter",
                "ctrlKey": false,
                "action": "restore",
                "addClickhandler": true,
                "clickhandlerElement": "#restoreSelectedFile",
                "descriptionKey": "RESTOREBUTTON"
            }],
    }
};