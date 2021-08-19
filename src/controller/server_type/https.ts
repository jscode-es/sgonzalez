// Environment variable
const $ = process.env;

// Loading Node JS modules
import path from "path"
import fs from "fs"

// Modules required for the server
import express from "express"
import https from "https"
import cookie from "cookie-parser"
import cors from "cors"
import session from "express-session"
import compression from "compression"

import { ISettingServer } from "@interface/ISettingServer"

// Router
import router from "@controller/router"


export default class HTTP2 {

    private app: any
    private setting: ISettingServer
    private server: any

    constructor(setting: ISettingServer) {
        // Application
        this.app = express()

        // Setting
        this.setting = setting
    }

    start() {
        let { forceSSL, limit, extended } = this.setting

        let certificate = HTTP2.getCertificate()

        if (certificate.error) {
            console.log('[ HTTP2 ]', certificate.error)
            return false;
        }

        // Server
        this.server = https.createServer(certificate, this.app);

        // Forzar ssl
        forceSSL && this.app.use(this.forceSSL)

        // Peticiones JSON
        this.app.use(this.isJsonRequest)

        // Ip del cliente
        this.app.use(this.setIpClient)

        // Favicon
        this.favicon()

        // Cookie
        this.app.use(cookie())

        // Session
        this.app.use(session({
            secret: $.SECRET_SESSION || "",
            name: 'farmaconnect',
            //proxy: true,
            resave: false,
            cookie: { secure: false },
            saveUninitialized: true
        }))

        // Favicon
        this.app.use(compression())

        // Contentido estatico
        this.contentStatic()

        // Limite de trafico
        this.app.use(express.json({ limit }))

        // Fomularios
        this.app.use(express.urlencoded({ extended }))

        // Parser aplicaciones CORS
        this.cors()

        // Seguridad
        this.app.use(this.secure)
        this.app.disable('x-powered-by')
        this.app.disable('etag')

        // Sistema de renderizado
        this.app.set('views', $.view)
        this.app.set('view engine', 'pug')

        // listener
        this.listener()

        return true
    }

    private static getCertificate() {
        let cert = path.resolve($.CERT || "")
        let key = path.resolve($.CERT_KEY || "")
        let ca = path.resolve($.CERT_CA || "")

        let { error } = HTTP2._isCertificateExist([cert, key, ca])

        if (error == null) {
            return {
                cert: fs.readFileSync(cert),
                key: fs.readFileSync(key),
                ca: fs.readFileSync(ca),
                requestCert: true,
                rejectUnauthorized: false
            }
        }

        return { error }
    }

    private static _isCertificateExist(certificates: string[]) {
        let error = null

        for (const cert of certificates) {

            if (!fs.existsSync(cert)) {
                error = `This certificate has not been found -> ${cert}`
                break
            }
        }

        return { error }
    }

    // Cabecera
    header() {
        this.app.use((req: any, res: any, next: any) => {
            req;
            if (res.hasOwnProperty('setHeader')) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,PATCH')
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
                res.setHeader('Access-Control-Allow-Credential', true)
                res.setHeader('Content-Security-Policy', "default-src 'self'")
            }

            next()

        });
    }

    forceSSL(req: any, res: any, next: any) {
        if (!req.secure) {
            return res.redirect("https://" + req.headers.host + req.url)
        }

        next()
    }

    secure(req: any, res: any, next: any) {
        res;
        let nowAllow = ['php', 'cli', 'asp']

        let url = req.url.split('/')
        let last = url[url.length - 1]
        let file = last.split('.')
        let ext = file[file.length - 1]

        if (nowAllow.indexOf(ext) != -1) {
            //return new Response(res).notAuth();
        }

        next();
    }

    isJsonRequest(req: any, res: any, next: any) {
        res;
        req.isJsonRequest = function () {

            return req.xhr || /json/i.test(req.headers.accept)
        };

        req.isJsonRequest = req.isJsonRequest()

        next()
    }

    // Ip del cliente
    setIpClient(req: any, res: any, next: any) {
        res;
        req.ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        next()
    }

    // Parser aplicaciones CORS
    cors() {
        let options =
        {
            origin: '*', // Reemplazar con dominio
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }

        this.app.use(cors(options))
    }

    // Favicon
    favicon() {
        //this.app.use(favicon($.contentPublic + '/favicon.ico'))
    }

    // Contenido estatico
    contentStatic() {
        // https://cloud.localhost/.src/js/login/main.ts
        let content = express.static($.contentPublic || "", { etag: false, dotfiles: 'ignore' })
        this.app.use(content)
    }

    redirectSSL() {
        express()
            .get('*', (req, res) => res.redirect("https://" + req.headers.host + req.url))
            .listen(80)

    }

    listener() {
        let that = this
        let { server } = that

        let { port, portSecure, forceSSL } = this.setting

        let _port = forceSSL ? portSecure : port

        if (forceSSL) {
            this.redirectSSL()
        }

        // Escuchar servicio
        server.listen(_port, $.IP_HOST, () => {
            console.log(`[ Server ] ${$.IP_HOST}:${_port}`)

            // Enrutamiento
            that.app.use('/', router.getRouter)


            // Controlador de errores
            that.app.use((req: any, res: any, next: any) => {
                req; next;
                res.status(404).send('Sorry cant find that!')
            });


        });
    }
}