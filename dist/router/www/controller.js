"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const render_1 = __importDefault(require("../../controller/render"));
class Controller {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.init();
    }
    async init() {
        let res = this.res;
        let req = this.req;
        let { method, params, isJsonRequest, query } = req;
        let { service } = params;
        console.log({ service, isJsonRequest, query, method, params });
        if (service) {
            method = method.toLowerCase();
            service = service.toLowerCase().trim();
            if (method === 'get') {
                const viewDir = path_1.default.resolve(`${$.web}/page/${service}.pug`);
                if (fs_1.default.existsSync(viewDir)) {
                    let html = await Controller.render(service);
                    if (html) {
                        return res.send(html);
                    }
                }
            }
        }
        if (!isJsonRequest && service === undefined) {
            let html = await Controller.render(service);
            if (html) {
                return res.send(html);
            }
        }
        return res.status(404).send('Not found');
    }
    static async render(service) {
        let data = {};
        let page = service ? service : 'index';
        let redirectContent = page === 'index' ? 'index' : `page/${page}`;
        console.log({ redirectContent });
        let _pathContent = path_1.default.resolve(`${$.root}/view/www/${redirectContent}.pug`);
        let _pathController = path_1.default.resolve(`${__dirname}/../../router/www/get/${page}.js`);
        if (fs_1.default.existsSync(_pathController)) {
            let control = (await Promise.resolve().then(() => __importStar(require(_pathController)))).default;
            data = await control.getContent();
        }
        if (fs_1.default.existsSync(_pathContent)) {
            return render_1.default.pug(_pathContent, { data });
        }
        return false;
    }
}
exports.default = Controller;
//# sourceMappingURL=controller.js.map