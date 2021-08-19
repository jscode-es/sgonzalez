"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const is_ip_1 = __importDefault(require("is-ip"));
class Subdomain {
    constructor(req, domains) {
        this.req = req;
        this.domains = domains;
    }
    router() {
        let req = this.req;
        let domains = this.domains;
        let host = 'localhost';
        let subdomain = 'www';
        if (!is_ip_1.default(req.headers.host)) {
            if (req.headers.host) {
                host = req.headers.host.split(':')[0];
            }
        }
        let sub = host.split('.');
        let subLength = ($.NODE_ENV && $.NODE_ENV == 'development') ? 2 : 3;
        subdomain = sub.length == subLength ? sub[0] : subdomain;
        if (domains.indexOf(subdomain) == -1 && sub.length >= subLength) {
            return false;
        }
        subdomain = subdomain == 'www' ? 'www' : subdomain;
        req.subdomain = subdomain;
        return true;
    }
}
exports.default = Subdomain;
//# sourceMappingURL=subdomain.js.map