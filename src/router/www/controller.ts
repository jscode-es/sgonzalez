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
        let { method, params, isJsonRequest, query } = req;

        // Service
        let { service } = params;

        // Check request service
        if (service) {

            method = method.toLowerCase();
            service = service.toLowerCase().trim();

            const serviceDir = path.resolve(`${$.web}/${method}/${service}`);

            if (fs.existsSync(`${serviceDir}.js`)) {

                if (isJsonRequest) {
                    let result = await require(serviceDir).json(query, req);

                    return res.json(result);
                }

                return res.send('52');

            } else {

                return res.redirect('/');
            }

        }


        if (!isJsonRequest && service === undefined) {

            let render = await Controller.render(service);

            if (render) {
                return res.send(render);
            }
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