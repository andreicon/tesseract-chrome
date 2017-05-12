// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/*
 * This function is used to decode the message received from content scripts
 */
JSON.retrocycle = function retrocycle($) {
    "use strict";
    var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

    (function rez(value) {
        if (value && typeof value === "object") {
            if (Array.isArray(value)) {
                value.forEach(function (element, i) {
                    if (typeof element === "object" && element !== null) {
                        var path = element.$ref;
                        if (typeof path === "string" && px.test(path)) {
                            value[i] = eval(path);
                        } else {
                            rez(element);
                        }
                    }
                });
            } else {
                Object.keys(value).forEach(function (name) {
                    var item = value[name];
                    if (typeof item === "object" && item !== null) {
                        var path = item.$ref;
                        if (typeof path === "string" && px.test(path)) {
                            value[name] = eval(path);
                        } else {
                            rez(item);
                        }
                    }
                });
            }
        }
    }($));
    return $;
};


chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.getSelected(null, function(tab){
		if (!tab.url.match('chrome://')) {
			chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
				var decodedMessage = JSON.parse(JSON.retrocycle(msg))
			    console.log(decodedMessage) ;
			    chrome.storage.sync.set({'value': decodedMessage});
			    chrome.storage.sync.get(['value'], function(items){console.log(items)});
			});
		}
	});
});
