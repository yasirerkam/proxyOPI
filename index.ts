import ProxyProvider from './src/proxyProvider';

export default class ProxyOPI {

    private static instance: ProxyOPI;
    private proxyProvider!: ProxyProvider;
    private constructor() { }

    public static async getInstanceAsync(options: any, pathProxyList: string, timeout: number = 4 * 60) {
        if (this.instance === undefined || this.instance === null) {
            this.instance = new ProxyOPI();
            // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
            this.instance.proxyProvider = await ProxyProvider.getInstanceAsync(options, pathProxyList, timeout);
        }

        return this.instance;
    }

    async getProxyListAsync(newly: boolean = false) {
        if (this.proxyProvider === undefined || this.proxyProvider === null) {
            console.log("\nProxy provider is undefined or null.");
            return undefined;
        }

        if (newly)
            return await this.proxyProvider.getNewProxyListAsync();
        else
            return await this.proxyProvider.getProxyListAsync();

    }
}

async function test() {
    const proxyOPI = await ProxyOPI.getInstanceAsync({ protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] }, "./data/proxyList.json");
    const proxyList = await proxyOPI.getProxyListAsync(false);
    // console.log("\nProxy list is:\n", proxyList);
}

(async () => {
    await test().catch(err => {
        console.error(err);
    });
})();

