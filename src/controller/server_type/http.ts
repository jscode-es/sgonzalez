// Environment variable
const $ = process.env;

// Modules required for the server
import express from "express"
import http from "http"
import cookie from "cookie-parser"
import cors from "cors"
import compression from "compression"

import { ISettingServer } from "@interface/ISettingServer"

// Router
import router from "@controller/router"


export default class HTTP {

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
        let { limit, extended } = this.setting

        // Server
        this.server = http.createServer(this.app);

        // Peticiones JSON
        this.app.use(this.isJsonRequest)

        // Ip del cliente
        this.app.use(this.setIpClient)

        // Favicon
        this.favicon()

        // Cookie
        this.app.use(cookie())

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