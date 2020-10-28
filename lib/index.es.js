import React from 'react';
import Auth0Lock from 'auth0-lock';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var _a;
var Provider = (_a = React.createContext({
    lock: undefined,
    login: function () { return null; },
    logout: function () { return null; },
    expiresAt: null,
}), _a.Provider), Consumer = _a.Consumer;

function AuthConsumer(props) {
    var children = props.children;
    return React.createElement(Consumer, null, function (props) { return children(__assign({}, props)); });
}

var AuthProvider = /** @class */ (function (_super) {
    __extends(AuthProvider, _super);
    function AuthProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.setSession = function (authResult, profile) {
            var session = {
                isAuthenticated: true,
                accessToken: authResult.accessToken,
                idToken: authResult.idToken,
                idTokenPayload: authResult.idTokenPayload,
                expiresAt: JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime()),
                profile: profile,
            };
            _this.setState(function (currentState) { return (__assign(__assign({}, currentState), session)); }, function () {
                _this.lock.hide();
                _this.scheduleRenewal();
                _this.storeSession(session);
            });
        };
        _this.storeSession = function (session) {
            var storageKey = _this.props.storageKey;
            localStorage.setItem(storageKey, JSON.stringify(session));
        };
        _this.getStoredSession = function () {
            var storageKey = _this.props.storageKey;
            var session = localStorage.getItem(storageKey);
            return session ? JSON.parse(session) : null;
        };
        _this.isSessionExpired = function (expiresAt) {
            return new Date().getTime() > expiresAt;
        };
        _this.rehyrate = function () {
            var showLock = _this.props.showLock;
            var session = _this.getStoredSession();
            if (session && !_this.isSessionExpired(session.expiresAt)) {
                _this.setState(session, function () {
                    _this.scheduleRenewal();
                });
            }
            else {
                if (showLock) {
                    _this.lock.show();
                }
            }
        };
        _this.login = function () {
            _this.lock.show();
        };
        _this.logout = function (returnTo) {
            var storageKey = _this.props.storageKey;
            localStorage.removeItem(storageKey);
            clearTimeout(_this.tokenRenewalTimeout);
            _this.lock.logout({
                returnTo: returnTo,
            });
        };
        _this.scheduleRenewal = function () {
            var expiresAt = _this.state.expiresAt;
            var delay = Number(expiresAt) - Date.now();
            if (delay > 0) {
                _this.tokenRenewalTimeout = setTimeout(function () {
                    _this.renewToken();
                }, delay);
            }
        };
        _this.renewToken = function () {
            _this.lock.checkSession({}, function (err, authResult) {
                if (err || !authResult) {
                    _this.lock.show();
                }
                else {
                    _this.lock.getUserInfo(authResult.accessToken, function (error, profile) {
                        _this.setSession(authResult, profile);
                    });
                }
            });
        };
        _this.lock = new Auth0Lock(props.clientId, props.domain, props.options);
        _this.tokenRenewalTimeout = null;
        _this.state = {
            lock: _this.lock,
            login: _this.login,
            logout: _this.logout,
            expiresAt: null,
        };
        return _this;
    }
    AuthProvider.prototype.componentDidMount = function () {
        var _this = this;
        this.rehyrate(); // Sync local storage to state
        this.lock.on("authenticated", function (authResult) {
            _this.lock.getUserInfo(authResult.accessToken, function (error, profile) {
                if (error) {
                    throw new Error(error.description);
                }
                _this.setSession(authResult, profile);
            });
        });
    };
    AuthProvider.prototype.render = function () {
        var children = this.props.children;
        return React.createElement(Provider, { value: this.state }, children);
    };
    AuthProvider.defaultProps = {
        storageKey: "auth:auth0",
        options: {},
    };
    return AuthProvider;
}(React.Component));

function withAuth(Component) {
    return function AuthComponent(props) {
        return (React.createElement(Consumer, null, function (auth) { return React.createElement(Component, __assign({}, props, { auth: auth })); }));
    };
}

export { AuthConsumer, AuthProvider, withAuth };
//# sourceMappingURL=index.es.js.map
