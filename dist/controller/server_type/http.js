"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const router_1 = __importDefault(require("../router"));
class HTTP {
    constructor(setting) {
        this.app = express_1.default();
        this.setting = setting;
    }
    start() {
        let { limit, extended } = this.setting;
        this.server = http_1.default.createServer(this.app);
        this.app.use(this.isJsonRequest);
        this.app.use(this.setIpClient);
        this.favicon();
        this.app.use(cookie_parser_1.default());
        this.app.use(compression_1.default());
        this.contentStatic();
        this.app.use(express_1.default.json({ limit }));
        this.app.use(express_1.default.urlencoded({ extended }));
        this.cors();
        this.app.use(this.secure);
        this.app.disable('x-powered-by');
        this.app.disable('etag');
        this.app.set('views', $.view);
        this.app.set('view engine', 'pug');
        this.listener();
        return true;
    }
    header() {
        this.app.use((req, res, next) => {
            req;
            if (res.hasOwnProperty('setHeader')) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,PATCH');
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Credential', true);
                res.setHeader('Content-Security-Policy', "default-src 'self'");
            }
            next();
        });
    }
    secure(req, res, next) {
        res;
        let nowAllow = ['php', 'cli', 'asp'];
        let url = req.url.split('/');
        let last = url[url.length - 1];
        let file = last.split('.');
        let ext = file[file.length - 1];
        if (nowAllow.indexOf(ext) != -1) {
        }
        next();
    }
    isJsonRequest(req, res, next) {
        res;
        req.isJsonRequest = function () {
            return req.xhr || /json/i.test(req.headers.accept);
        };
        req.isJsonRequest = req.isJsonRequest();
        next();
    }
    setIpClient(req, res, next) {
        res;
        req.ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        next();
    }
    cors() {
        let options = {
            origin: '*',
            optionsSuccessStatus: 200
        };
        this.app.use(cors_1.default(options));
    }
    favicon() {
    }
    contentStatic() {
        let content = express_1.default.static($.contentPublic || "", { etag: false, dotfiles: 'ignore' });
        this.app.use(content);
    }
    redirectSSL() {
        express_1.default()
            .get('*', (req, res) => res.redirect("https://" + req.headers.host + req.url))
            .listen(80);
    }
    listener() {
        let that = this;
        let { server } = that;
        let { port, portSecure, forceSSL } = this.setting;
        let _port = forceSSL ? portSecure : port;
        if (forceSSL) {
            this.redirectSSL();
        }
        server.listen(_port, $.IP_HOST, () => {
            console.log(`[ Server ] ${$.IP_HOST}:${_port}`);
            that.app.use('/', router_1.default.getRouter);
            that.app.use((req, res, next) => {
                req;
                next;
                res.status(404).send('Sorry cant find that!');
            });
        });
    }
}
exports.default = HTTP;
//# sourceMappingURL=http.js.map