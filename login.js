/*
 * login.js
 *
 * this script will submit a login-request using private-fields
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
    var LoginClass, loginInstance, xhr;
    // create class with private-fields and accessors
    LoginClass = function () {
        var privatePassword, privateUsername;
        this.getPassword = function () {
            return privatePassword;
        };
        this.getUsername = function () {
            return privateUsername;
        };
        this.setPassword = function (password) {
            privatePassword = password;
        };
        this.setUsername = function (username) {
            privateUsername = username;
        };
    };
    // init event-handling
    document.querySelector('#inputSubmit').addEventListener('click', function () {
        // create class-instance and set private-fields from dom-inputs
        loginInstance = new LoginClass();
        loginInstance.setPassword(document.querySelector('#inputPassword').value);
        loginInstance.setUsername(document.querySelector('#inputUsername').value);
        // submit login-request through XMLHttpRequest with private-fields
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/login');
        xhr.send(JSON.stringify({
            password: loginInstance.getPassword(),
            username: loginInstance.getUsername()
        }));
    });
    console.log('loaded script <script src="login.js"></script>\n');
}());
