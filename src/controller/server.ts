import { ISettingServer } from "./interface/ISettingServer"
import http from "./server_type/http"
import http2 from "./server_type/http2"
import https from "./server_type/https"

class server {

    static HTTP2: string = 'http2'
    static HTTPS: string = 'https'
    static HTTP: string = 'http'

    private setting?: ISettingServer

    constructor(type: string = server.HTTP2, options: Object = {}) {

        if (typeof type === 'string') {
            // Start setting
            this.setSetting(options)

            // Create Server
            this.create(type)
        }
    }

    // Setting to server
    private setSetting(options: Object): void {
        let _default: ISettingServer =
        {
            forceSSL: false,
            limit: '50mb',
            extended: false,
            port: 80,
            portSecure: 443
        }

        Object.assign(_default, options)

        this.setting = _default
    }

    // Create server
    private create(typeServer: string) {
        let type = new String(typeServer).toLowerCase()

        this.setRequiredSSL(type)

        if (type === server.HTTP2) {
            new http2(this.getSetting()).start()
            return;

        } else if (type === server.HTTPS) {

            new https(this.getSetting()).start()
            return;
        } else if (type === server.HTTP) {

            new http(this.getSetting()).start()
            return;
        }

        // Warning
        console.warn(`Server type ${type} is not valid`);
    }

    // Required force SSL
    private setRequiredSSL(type: string) {
        if (type === 'https' || type === 'http2' || type === 'ftps' || type === 'wss') {
            let setting = this.getSetting();

            Object.assign(setting, { forceSSL: true });

            this.setSetting(setting);
        }
    }


    // Get Setting server
    getSetting(): any {
        return this.setting;
    }
}

export default server