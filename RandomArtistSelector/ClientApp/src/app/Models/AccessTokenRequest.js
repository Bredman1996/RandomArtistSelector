"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AccessTokenRequest = /** @class */ (function () {
    function AccessTokenRequest(grant_type, code, redirect_uri, client_id, client_secret) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.code = code;
        this.grant_type = grant_type;
        this.redirect_uri = redirect_uri;
    }
    return AccessTokenRequest;
}());
exports.AccessTokenRequest = AccessTokenRequest;
//# sourceMappingURL=AccessTokenRequest.js.map