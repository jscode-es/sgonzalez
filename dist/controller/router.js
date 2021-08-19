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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const language_1 = __importDefault(require("./language"));
const subdomain_1 = __importDefault(require("./subdomain"));
class Router {
    static async getRouter(req, res, next) {
        let allowSubdomains = ['www'];
        let language = new language_1.default(req);
        let subdomain = new subdomain_1.default(req, allowSubdomains);
        language.client();
        subdomain.router();
        req.method = req.method.toLowerCase();
        req.params = Router.getParamsUrl(req._parsedUrl.pathname);
        let route = req.subdomain ? req.subdomain : 'www';
        let pathController = path_1.default.join(`${__dirname}/../router/${route}/controller`);
        if (!fs_1.default.existsSync(pathController + '.js')) {
            console.log(`[ Router ] This controller not found: ${route}`);
            return next();
        }
        if (Router.domains[route] === undefined) {
            Router.domains[route] = (await Promise.resolve().then(() => __importStar(require(pathController)))).default;
        }
        let domains = Router.domains[route];
        new domains(req, res, next);
    }
    static getParamsUrl(pathname) {
        let params = pathname.split('/').join(' ').trim().split(' ');
        let paramsObj = {};
        let i = 0;
        let paramName = ['service', 'page'];
        for (const param of params) {
            if (param.length != 0) {
                if (paramName[i])
                    paramsObj[paramName[i]] = param;
                else
                    paramsObj[i] = param;
            }
            i++;
        }
        return paramsObj;
    }
}
exports.default = Router;
Router.domains = {};
//# sourceMappingURL=router.js.map