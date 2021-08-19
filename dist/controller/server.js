"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("./server_type/http"));
const http2_1 = __importDefault(require("./server_type/http2"));
const https_1 = __importDefault(require("./server_type/https"));
class server {
    constructor(type = server.HTTP2, options = {}) {
        if (typeof type === 'string') {
            this.setSetting(options);
            this.create(type);
        }
    }
    setSetting(options) {
        let _default = {
            forceSSL: false,
            limit: '50mb',
            extended: false,
            port: 80,
            portSecure: 443
        };
        Object.assign(_default, options);
        this.setting = _default;
    }
    create(typeServer) {
        let type = new String(typeServer).toLowerCase();
        this.setRequiredSSL(type);
        if (type === server.HTTP2) {
            new http2_1.default(this.getSetting()).start();
            return;
        }
        else if (type === server.HTTPS) {
            new https_1.default(this.getSetting()).start();
            return;
        }
        else if (type === server.HTTP) {
            new http_1.default(this.getSetting()).start();
            return;
        }
        console.warn(`Server type ${type} is not valid`);
    }
    setRequiredSSL(type) {
        if (type === 'https' || type === 'http2' || type === 'ftps' || type === 'wss') {
            let setting = this.getSetting();
            Object.assign(setting, { forceSSL: true });
            this.setSetting(setting);
        }
    }
    getSetting() {
        return this.setting;
    }
}
server.HTTP2 = 'http2';
server.HTTPS = 'https';
server.HTTP = 'http';
exports.default = server;
//# sourceMappingURL=server.js.map