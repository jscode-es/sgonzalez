"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class Language {
    constructor(req) { this.req = req; }
    client() {
        let req = this.req;
        let cookies = req.cookies;
        let languages = (req.get('accept-language') == undefined) ? 'es-es;' : req.get('accept-language');
        let primary = languages.split(';')[0].split('-')[0];
        if (typeof cookies.hasOwnProperty === 'function') {
            req.lang = ('lang' in cookies) ? cookies.lang : primary;
            return true;
        }
        req.lang = primary;
        return true;
    }
    static getData(lang = 'es') {
        let _path = path_1.default.resolve($.root || "", 'i18n', `${lang}.json`);
        if (!fs_1.default.existsSync(_path)) {
            _path = path_1.default.resolve($.root || "", 'i18n', `en.json`);
        }
        return require(_path);
    }
    static currentLanguage() {
        return ['es', 'en'];
    }
}
exports.default = Language;
//# sourceMappingURL=language.js.map