import path from 'path';
import JsonFileOps from './jsonFileOps';
import SourceManager from './sourceManager';

export const enum AnonymityLevel { transparent = "transparent", anonymous = "anonymous", elite = "elite", unknown = "" }
export const enum Protocol { http = "http", https = "https", socks4 = "socks4", socks5 = "socks5", unknown = "" }
export type Proxy = { ip: string, port: string, protocols: Protocol[], sourceSite: string, anonymityLevel?: AnonymityLevel, lastTested?: string, country?: string, city?: string, isp?: string, speed?: string, uptime?: string, responseTime?: string, verified?: string, };
export type ProxyList = { dateTime: number, list: Proxy[] };

export default class ProxyProvider {


    //#region properties

    private static instance: ProxyProvider;
    options: any;
    timeout: number;
    sourceManager!: SourceManager;

    //#region CurrentProxy
    private currentProxy?: Proxy = undefined;
    private setCurrentProxy(value?: Proxy) {
        this.currentProxy = value;
        console.log("\nCurrent proxy is set:\n", this.currentProxy);
    }
    getCurrentProxy() { return this.currentProxy; }
    //#endregion CurrentProxy

    //#region ProxyList

    private proxyList!: ProxyList;
    setProxyList(value: ProxyList, save: boolean = true) {
        this.proxyList = value;
        this.proxyList.list = this.shuffle(this.proxyList.list);
        console.log("\nProxy list is set. Number of proxies: %d.", this.proxyList.list.length);
        if (save)
            this.writeProxyListObjFile();
    }
    async getProxyListAsync(): Promise<ProxyList> {
        if (this.proxyList === undefined || this.proxyList === null) {
            console.log("\nProxy list value is undefined or null.");
            return await this.getNewProxyListAsync();
        }
        else if (this.proxyList.dateTime === undefined || this.proxyList.dateTime === null) {
            console.log("\nProxy list dateTime value is undefined or null.");
            return await this.getNewProxyListAsync();
        }
        else if (this.proxyList.list === undefined || this.proxyList.list === null || this.proxyList.list.length === 0) {
            console.log("\nProxy list value is undefined, null or empty.");
            return await this.getNewProxyListAsync();
        }
        else if ((Date.now() - this.proxyList.dateTime) > this.timeout) {
            console.log("\nProxy list is expired.");
            return await this.getNewProxyListAsync();
        }

        return this.proxyList;
    }

    //#region pathProxyList
    private pathProxyList: string;
    setPathProxyList(value: string) {
        this.pathProxyList = value;
        console.log("\npathProxyList is set to '%s'.", value);
        this.pathProxyListParsed = path.parse(value);
    }
    getPathProxyList(): string {
        return this.pathProxyList;
    }
    //#endregion pathProxyList

    //#region pathProxyListParsed
    private pathProxyListParsed!: path.ParsedPath;
    setPathProxyListParsed(value: path.ParsedPath) {
        this.pathProxyListParsed = value;
        console.log("pathProxyListParsed is set.");
    }
    getPathProxyListParsed(): path.ParsedPath {
        if (this.pathProxyListParsed === null || this.pathProxyListParsed === undefined)
            this.pathProxyListParsed = path.parse(this.pathProxyList);

        return this.pathProxyListParsed;
    }
    //#endregion pathProxyListParsed

    //#endregion ProxyList

    //#endregion properties

    private constructor(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000) {
        this.options = options;
        this.pathProxyList = pathProxyList;
        this.timeout = timeout;
    }

    static async getInstanceAsync(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000): Promise<ProxyProvider> {
        if (this.instance === undefined || this.instance === null) {
            this.instance = new ProxyProvider(options, pathProxyList, timeout);

            await SourceManager.getInstanceAsync().then(async sourceManager => {
                this.instance.sourceManager = sourceManager;
            }).then(async () => {
                await this.instance.readProxyListObjFileAsync();
            });
        }

        return this.instance;
    }


    async getNewProxyListAsync(): Promise<ProxyList> {
        const proxyList = { dateTime: Date.now(), list: await this.sourceManager.getProxyList() };
        this.setProxyList(proxyList);

        return proxyList;
    }

    printCurrentProxy() {
        console.log("\nCurrent proxy is:\n", this.currentProxy);
    }

    private writeProxyListObjFile(format = false) {
        JsonFileOps.writeJson(this.proxyList, this.pathProxyList, { flag: 'w' }, format);
    }

    private async readProxyListObjFileAsync(): Promise<void> {
        try {
            if (!JsonFileOps.isFileExists(this.pathProxyList))
                await this.getNewProxyListAsync();

            const proxyList = JsonFileOps.readJson(this.pathProxyList);
            if (proxyList === undefined || proxyList === null || proxyList.dateTime === undefined || proxyList.dateTime === null || proxyList.list === undefined || proxyList.list === null || proxyList.list.length === 0)
                await this.getNewProxyListAsync();
            else
                this.setProxyList(proxyList, false);
        }
        catch (error) {
            console.log("\nError occured while reading proxy list:\n", error);
            await this.getNewProxyListAsync();
        }
    }

    private shuffle(array: any[]) {
        for (let i = array?.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


}