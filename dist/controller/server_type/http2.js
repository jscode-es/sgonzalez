"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = process.env;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http2_1 = __importDefault(require("http2"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const compression_1 = __importDefault(require("compression"));
const router_1 = __importDefault(require("../router"));
class HTTP2 {
    constructor(setting) {
        this.app = express_1.default();
        this.setting = setting;
    }
    start() {
        let { forceSSL, limit, extended } = this.setting;
        let certificate = HTTP2.getCertificate();
        if (certificate.error) {
            console.log('[ HTTP2 ]', certificate.error);
            return false;
        }
        this.server = http2_1.default.createSecureServer(certificate, this.app);
        forceSSL && this.app.use(this.forceSSL);
        this.app.use(this.isJsonRequest);
        this.app.use(this.setIpClient);
        this.favicon();
        this.app.use(cookie_parser_1.default());
        this.app.use(express_session_1.default({
            secret: $.SECRET_SESSION || "",
            name: 'farmaconnect',
            resave: false,
            cookie: { secure: false },
            saveUninitialized: true
        }));
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
    static getCertificate() {
        let cert = path_1.default.resolve($.CERT || "");
        let key = path_1.default.resolve($.CERT_KEY || "");
        let ca = path_1.default.resolve($.CERT_CA || "");
        let { error } = HTTP2._isCertificateExist([cert, key, ca]);
        if (error == null) {
            return {
                cert: fs_1.default.readFileSync(cert),
                key: fs_1.default.readFileSync(key),
                ca: fs_1.default.readFileSync(ca),
                requestCert: true,
                rejectUnauthorized: false
            };
        }
        return { error };
    }
    static _isCertificateExist(certificates) {
        let error = null;
        for (const cert of certificates) {
            if (!fs_1.default.existsSync(cert)) {
                error = `This certificate has not been found -> ${cert}`;
                break;
            }
        }
        return { error };
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
    forceSSL(req, res, next) {
        if (!req.secure) {
            return res.redirect("https://" + req.headers.host + req.url);
        }
        next();
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
exports.default = HTTP2;
//# sourceMappingURL=http2.js.map