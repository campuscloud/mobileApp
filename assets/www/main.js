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
//Define global cloud object
var cloud;
$(document).ready(function () {
    //console.log = mosync.rlog;
    console.log("main.js loaded");
    cloud = new frontendProduction();
    //var cloud = new frontendDummy();
    console.log("Frontend loaded: " + cloud);

    //Set vendor prefixes
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                     window.MozBlobBuilder;
    window.requestFileSystem = window.requestFileSystem ||
                               window.webkitRequestFileSystem;



    // Sprache einstellen - Systemsprache
    var systemLang;

    // Auf falschen Seiten
    if (!$ || !$.mobile || !$.mobile.activePage || $.mobile.activePage.attr('id') !== "loginPage") {
        console.log("Start mit falscher Seite!");
        window.location.href = "index.html";
    }

    // Initialisierung
    cloud.doInit({
    });

    // Eigenschaft für Zusatzfunktionen bereitstellen
    if (!cloud.pages) {
        cloud.pages = {};
    }
    if (!cloud.functions) {
        cloud.functions = {};
    }

    cloud.storage = {};
    console.log("Storage loaded");
    cloud.storage.getItem = function (key) {
        if (typeof localStorage[key] == "undefined" || localStorage[key] == "{}") {
            return null;
        }
        return JSON.parse(localStorage[key]);
    }
    cloud.storage.setItem = function (key, object) {
        localStorage[key] = JSON.stringify(object);
    }
    cloud.storage.deleteItem = function (key) {
        delete (localStorage[key]);
    }
    // Set global eventhandler for page load
    // Controller is loaded when page has been changed
    // Name pages id: abcPage
    // Name controller-JS File: abc.js
    cloud.pages.pageLoadEvent = function (event, ui) {
        var activePageId = String($.mobile.activePage.attr('id'));
        var nextPageId = activePageId.replace(/Page/g, "");
        var controllerScript = nextPageId + ".js";
        // Load script and start init-Method
        jQuery.getScript(controllerScript, function () {
            if (cloud.pages[nextPageId] && typeof cloud.pages[nextPageId].init == "function") {
                cloud.pages[nextPageId].init();
            }
        });
    };

    cloud.initializing = true;
    // Sprache einstellen - Systemsprache
    systemLang = cloud.getSystemLanguage();
    cloud.setCustomLanguage({
        customLanguage: systemLang
    });

    $(document).on('pageshow', cloud.pages.pageLoadEvent);

    jQuery.extend({
        getScript: function (url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.src = url;

            // Handle Script loading
            {
                var done = false;

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                        done = true;
                        if (callback)
                            callback();

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                    }
                };
            }

            head.appendChild(script);

            // We handle everything using the script element injection
            return undefined;
        }
    });

    // Get Started
    $(document).bind("mobileinit", function () {
        $.mobile.allowCrossDomainPages = true;
        $.support.cors = true;
    });


    //Workaround for iOS
    (function ($) {
        //=================================================================================
        var FSroot;
        $(document).ready(function () {
            $(document).bind("deviceready", init);
        });
        function init() {
           // alert("init");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onInitFs, fail);
            function onInitFs(fs) {
               // alert('Opened file system: ' + fs.name);
                FSroot = fs.root;
                main();
            }
            function fail(error) {
                console.log(error.code);
            }
        }
        function main() {
            $("#div1").click(function () {
               // alert("Clicked");
                doWrite();
            });
        }
        function doWrite() {
            alert("CHECK1");
            FSroot.getFile("fileName1.txt", { create: true }, gotFileEntry, fail);
            function gotFileEntry(fileEntry) {
                fileEntry.createWriter(gotFileWriter, fail);
                function gotFileWriter(writer) {
                    writer.onwrite = function (evt) {
                 //       alert("Write success!!");
                    };
                    writer.write("some text");
                }
            }
            function fail(error) {
                console.log(error.code);
            }
        }
        //=================================================================================
    })(jQuery)

    jQuery.getScript("functions.js");
    jQuery.getScript("login.js");
});
