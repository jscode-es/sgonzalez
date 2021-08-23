// Environment variable
const $ = process.env

// Loading Node JS modules
import path from "path"
import fs from "fs"

// Load controller
import render from "@controller/render"

export default class Controller {
    private req: any
    private res: any

    constructor(req: any, res: any) {
        this.req = req
        this.res = res

        this.init();
    }

    async init() {
        let res = this.res;
        let req = this.req;

        // Request data
        let { method, params, isJsonRequest, query, body } = req;

        // Service
        let { service } = params;

        console.log({ service, isJsonRequest, query, method, params, body })

        // Check request service
        if (service) {

            method = method.toLowerCase();
            service = service.toLowerCase().trim();

            if (method === 'get') {

                const viewDir = path.resolve(`${$.web}/page/${service}.pug`);

                if (fs.existsSync(viewDir)) {

                    let html = await Controller.render(service);

                    if (html) return res.send(html);

                }

            }

            if (method === 'post') {

                const dir = path.resolve(`${__dirname}/post/${service}.js`);

                if (fs.existsSync(dir)) {

                    let controller = (await import(dir)).default

                    let data = controller.json({ body })

                    let error = (data) ? 200 : 400

                    return res.status(error).json({ data })
                }
            }

        }

        if (!isJsonRequest && service === undefined) {

            let html = await Controller.render(service);

            if (html) return res.send(html);

        }

        return res.status(404).send('Not found');
    }

    // Renderizar html
    static async render(service: string) {

        // Data send to render
        let data = {};

        // Page to render
        let page = service ? service : 'index';

        let redirectContent = page === 'index' ? 'index' : `page/${page}`;
        let _pathContent = path.resolve(`${$.root}/view/www/${redirectContent}.pug`);
        let _pathController = path.resolve(`${__dirname}/../../router/www/get/${page}.js`);

        if (fs.existsSync(_pathController)) {
            let control = (await import(_pathController)).default
            data = await control.getContent()
        }

        if (fs.existsSync(_pathContent)) {
            return render.pug(_pathContent, { data });
        }

        return false;
    }

}