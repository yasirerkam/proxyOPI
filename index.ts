import ProxyProvider from './src/proxyProvider';

export default class ProxyOPI {

    private static instance: ProxyOPI;
    private proxyProvider!: ProxyProvider;
    private constructor() { }

    public static async getInstanceAsync(pathProxyList: string, timeout: number = 4 * 60) {
        if (this.instance === undefined || this.instance === null) {
            this.instance = new ProxyOPI();
            // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
            this.instance.proxyProvider = await ProxyProvider.getInstanceAsync(pathProxyList, timeout);
        }

        return this.instance;
    }

    async getProxyListAsync(options: any, newly: boolean = false) {
        if (this.proxyProvider === undefined || this.proxyProvider === null) {
            console.log("\nProxy provider is undefined or null.");
            return undefined;
        }

        if (newly)
            return await this.proxyProvider.getNewProxyListAsync();
        else
            return await this.proxyProvider.getProxyListAsync(options);

    }
}

async function test() {
    const options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
    const proxyOPI = await ProxyOPI.getInstanceAsync("./data/proxyList.json");
    const proxyList = await proxyOPI.getProxyListAsync(options, false);
    // console.log("\nProxy list is:\n", proxyList);
}

(async () => {
    await test().catch(err => {
        console.error(err);
    });
})();

