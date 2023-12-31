import ProxyProvider from './src/proxyProvider';

export default class ProxyOPI {

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

    async getProxyListAsync(timeout: number = 4 * 60) {
        if (this.proxyProvider === undefined || this.proxyProvider === null) {
            console.log("\nProxy provider is undefined or null.");
            return undefined;
        }

        return await this.proxyProvider.getProxyListAsync(timeout);
    }
}

async function test() {
    const options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
    const proxyOPI = await ProxyOPI.getInstanceAsync("./data/proxyList.json");
    const proxyList = await proxyOPI.getProxyListAsync();
    // console.log("\nProxy list is:\n", proxyList);
}

(async () => {
    await test().catch(err => {
        console.error(err);
    });
})();

