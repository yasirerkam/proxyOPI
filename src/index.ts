import ProxyProvider, { ProxyList } from "./proxyProvider.js";

export class ProxyOPI {

    private static instance: ProxyOPI;
    private proxyProvider!: ProxyProvider;

    private constructor() { }

    public static async getInstanceAsync(pathProxyList: string) {
        if (this.instance === undefined || this.instance === null) {
            this.instance = new ProxyOPI();
            // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
            this.instance.proxyProvider = await ProxyProvider.getInstanceAsync(pathProxyList);
        }

        return this.instance;
    }

    async getProxyListAsync(timeout: number = 4 * 60): Promise<ProxyList> {
        if (this.proxyProvider === undefined || this.proxyProvider === null)
            throw new Error("\nProxy provider is undefined or null.");

        return await this.proxyProvider.getProxyListAsync(timeout);
    }
}

export { Proxy, ProxyList } from "./proxyProvider.js";

async function test() {
    const proxyOPI = await ProxyOPI.getInstanceAsync("./data/proxyList.json");
    const proxyList = await proxyOPI.getProxyListAsync(0);
    // console.log("\nProxy list is:\n", proxyList);
}

async function main() {
    return await test().catch(err => {
        return console.error("\n" + err);
    });
}

// main();
// console.error("end");
