"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyUser = /** @class */ (function () {
    function SpotifyUser() {
        this.request = {
            grant_type: "authorization_code",
            redirect_uri: "https://localhost:44315/spotify",
            code: "",
            client_id: "71562cadc5b6485c8688378f5979bf5b",
            client_secret: "14e2707243e44d8e8eb6b93c985c5ab9",
        };
    }
    return SpotifyUser;
}());
exports.SpotifyUser = SpotifyUser;
//# sourceMappingURL=SpotifyUser.js.map