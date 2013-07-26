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
console.log("login.js loaded");
// Initiate Login-View
var manual = [];
var items = [];
manual[0] = {
    configName: "",
    title: "Benutzerdefiniert",
    text: "Manuelle Konfiguration des Servers",
    picture: "images/gear.png",
    serverType: "manual",
    serverName: "",
    langKey: "SERVERCUSTOM",
    langKeyDesc: "SERVERDESCRIPTIONCUSTOM"
};

var i = 0;
for ( var serverObj in cloud.config.servers) {
	items[i] = {
		configName : cloud.config.servers[serverObj].name,
		title : cloud.config.servers[serverObj].title,
		text : cloud.config.servers[serverObj].description,
		picture : cloud.config.servers[serverObj].iconPath,
		serverType : cloud.config.servers[serverObj].type,
		serverName : serverObj,
		langKey : cloud.config.servers[serverObj].langKey,
		langKeyDesc : cloud.config.servers[serverObj].langKeyDesc
	};
	i++;
}

// Nach Namen sortieren
items.sort(function(first, second) {
	if (first.title == second.title) {
		return 0;
	} else if (first.title < second.title) {
		return -1;
	} else {
		return 1;
	}
});

// TODO: Manuelle Serverkonfiguration, aktuell deakiviert
var sortedList = items; //items.concat(manual);
$('#uniSelectList ').empty();
// ToDo: Bug-Workaround
$('#uniSelectList').append('<option value=""></option>');
for ( var element in sortedList) {
	$('#uniSelectList').append('<option value="' + sortedList[element].configName + '" lang="' + sortedList[element].langKey + '"></option>');
}
cloud.translateAll();
$("#uniSelectList").trigger('create');
$("#uniSelectList").selectmenu('refresh', true);

var login = {
	// To save the selected Item of University-List on change
	selectedItem : undefined,
	saveLoginKey : "saveLogin",
	// Temporary data to have access at success-callback on login credentials
	data: {},
	
	init: function () {
	    cloud.pages.login = {};
	    //Translate workaround for Checkbox
	    $('#saveLoginLabel .ui-btn-text').text(cloud.translate('STAYLOGGEDIN'));
	    //Load saved login data
	    if(cloud.isLoggedIn() || cloud.storage.getItem(login.saveLoginKey) != null){
	        var backendType = cloud.storage.getItem(login.saveLoginKey).backendType;
	        backendType.uploadFunction = cloud.functions.upload;
	        backendType.downloadFunction = cloud.functions.download;

	        cloud.setBackend(backendType);
	        cloud.doAuthentication(cloud.storage.getItem(login.saveLoginKey), login.loginSuccess, login.loginError);
		} else{
			// Seting Event-Handling for Login-Page
			// Login-Button
			document.getElementById("loginButton").onclick = login.loginButtonEvent;
			// List of Universitys
			$('#uniSelectList').on('change', function() {
				login.selectedItem = this.value;
			});
		}					
	},
	
	// Event sofern Login erfolgreich war
	loginSuccess: function (e) {
	    console.log("Login success");
		cloud.setLoggedIn({
			loginStatus : true
		});
		//Check wether 'save login' is selected
		if(document.getElementById("saveLogin").checked){
			//Save login credentials
			cloud.storage.setItem(login.saveLoginKey, login.data);	
		}
		$.mobile.changePage("#directoryPage", { transition: "slide" });
	},

	// Es gab einen Loginfehler
	loginError : function(e) {
		console.log("Login Error");
	},
	
	loginButtonEvent : function(eventInfo) {
		if (login.validateInput()) {
			// LOGIN-Daten auslesen
			// TODO: Speichern der Authentifizierungsinformationen...
			var username = document.getElementById("nameInput").value;
			var password = document.getElementById("passInput").value;
			
			login.data.username = username;
			login.data.password = password;

			login.data.backendType = {
			    type: "config",
			    host: login.selectedItem,
			    uploadFunction: cloud.functions.upload,
                downloadFunction: cloud.functions.download
			};

			// Backend festlegen und Anmelden
			if (login.data.backendType) {
				cloud.setBackend(login.data.backendType);
				cloud.doAuthentication(login.data, login.loginSuccess, login.loginError);
			}
		}
	},
	
	validateInput : function(){

		// Check preconditions...
		var validated = false;
		var username = document.getElementById("nameInput").value;
		var password = document.getElementById("passInput").value;
		if (username == "") {
			$("#nameInput").parent().addClass('missingInput');
			validated = false;
		} else {
			$("#nameInput").parent().removeClass('missingInput');
			validated = true;
		}
		if (password == "") {
			$("#passInput").parent().addClass('missingInput');
			validated = false;
		} else {
			$("#passInput").parent().removeClass('missingInput');
			validated = true;
		}
		if (typeof login.selectedItem == "undefined" || login.selectedItem == "") {
			$("#uniSelectList").parent().addClass('missingInput');
			validated = false;
		} else {
			$("#uniSelectList").parent().removeClass('missingInput');
			validated = true;
		}
		return validated;
	}
};
login.init();

