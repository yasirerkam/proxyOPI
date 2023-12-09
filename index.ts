import path from 'path';
import JsonFileOps from './src/jsonFileOps';

export type Proxy = { ip: string, port: string, protocols: [string], anonymityLevel?: string, lastTested?: string, country?: string, city?: string, isp?: string, speed?: string, uptime?: string, responseTime?: string, verified?: string, };
type ProxyList = { dateTime: number, list: [Proxy] };

export default class ProxyOPI {

    //#region properties

    static options: any;
    static timeout: number;

    //#region CurrentProxy
    private static currentProxy?: Proxy = undefined;
    private static setCurrentProxy(value?: Proxy) {
        this.currentProxy = value;
        console.log("\nCurrent proxy is set:\n", this.currentProxy);
    }
    static getCurrentProxy() { return this.currentProxy; }
    //#endregion CurrentProxy

    //#region ProxyList

    private static proxyList: ProxyList;
    static setProxyList(value: ProxyList, save: boolean = true) {
        this.proxyList = value;
        this.proxyList.list = this.shuffle(this.proxyList.list);
        console.log("\nProxy list is set.");
        if (save)
            this.writeProxyListObjFile();
    }
    static async getProxyList(): Promise<ProxyList> {
        const setNewProxyList = async () => {
            await this.getNewProxyList().then(proxyList => {
                this.setProxyList(proxyList)
            });
        }

        if (this.proxyList === undefined || this.proxyList === null) {
            console.log("\nProxy list value is undefined or null.");
            await setNewProxyList();
        }
        else if (this.proxyList.dateTime === undefined || this.proxyList.dateTime === null) {
            console.log("\nProxy list dateTime value is undefined or null.");
            await setNewProxyList();
        }
        else if (this.proxyList.list === undefined || this.proxyList.list === null) {
            console.log("\nProxy list value is undefined or null.");
            await setNewProxyList();
        }
        else if ((Date.now() - this.proxyList.dateTime) > this.timeout) {
            console.log("\nProxy list is expired.");
            await setNewProxyList();
        }

        return this.proxyList;
    }

    //#region pathProxyList
    private static pathProxyList: string;
    static setPathProxyList(value: string) {
        this.pathProxyList = value;
        console.log("\npathProxyList is set to '%s'.", value);
        this.pathProxyListParsed = path.parse(value);
    }
    static getPathProxyList(): string {
        return this.pathProxyList;
    }
    //#endregion pathProxyList

    //#region pathProxyListParsed
    private static pathProxyListParsed: path.ParsedPath;
    static setPathProxyListParsed(value: path.ParsedPath) {
        this.pathProxyListParsed = value;
        console.log("pathProxyListParsed is set.");
    }
    static getPathProxyListParsed(): path.ParsedPath {
        if (this.pathProxyListParsed === null || this.pathProxyListParsed === undefined)
            this.pathProxyListParsed = path.parse(this.pathProxyList);

        return this.pathProxyListParsed;
    }
    //#endregion pathProxyListParsed

    //#endregion ProxyList

    //#endregion properties


    static async asyncInit(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000) {
        // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
        this.options = options;
        this.pathProxyList = pathProxyList;
        this.timeout = timeout;
        await this.readProxyListObjFile();
    }


    static async getNewProxyList(): Promise<ProxyList> {
        return { dateTime: Date.now(), list: [{ ip: "string", port: "string", protocols: ["string"] }] };
    }

    static printCurrentProxy() {
        console.log("\nCurrent proxy is:\n", this.currentProxy);
    }

    private static writeProxyListObjFile(format = false) {
        JsonFileOps.writeJson(this.proxyList, this.pathProxyList, { flag: 'w' }, format);
    }

    private static async readProxyListObjFile(): Promise<void> {
        try {
            if (!JsonFileOps.isFileExists(this.pathProxyList))
                await this.getNewProxyList().then(proxyList => {
                    this.setProxyList(proxyList)
                });

            this.setProxyList(JsonFileOps.readJson(this.pathProxyList));
        }
        catch (error) {
            console.log("\nError occured while reading proxy list:\n", error);
            await this.getNewProxyList().then(proxyList => {
                this.setProxyList(proxyList)
            });
        }
    }

    private static shuffle(array: [any]) {
        for (let i = array?.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
