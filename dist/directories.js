"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const path_1 = __importDefault(require("path"));
$.root = process.cwd();
$.certificate = path_1.default.join($.root, 'certificate');
$.view = path_1.default.join($.root, 'view');
$.web = path_1.default.join($.view, 'www');
$.contentPublic = path_1.default.join($.root, 'public');
$.rssFilePublic = path_1.default.join($.root, 'public', 'index.xml');
$.sitemapFilePublic = path_1.default.join($.root, 'public', 'sitemap.xml');
$.IP_PRO = '0.0.0.0';
$.IP_HOST = $.NODE_ENV === 'development' ? '0.0.0.0' : $.IP_PRO;
console.log({
    node: $.NODE_ENV,
    ip: $.IP_HOST
});
$.CERT = $.NODE_ENV === 'development' ? $.CERT_DEV : $.CERT_PRO;
$.CERT_KEY = $.NODE_ENV === 'development' ? $.CERT_KEY_DEV : $.CERT_KEY_PRO;
$.CERT_CA = $.NODE_ENV === 'development' ? $.CERT_CA_DEV : $.CERT_CA_PRO;
$.HOST = $.NODE_ENV === 'development' ? $.HOST_DEV : $.HOST_PRO;
//# sourceMappingURL=directories.js.map