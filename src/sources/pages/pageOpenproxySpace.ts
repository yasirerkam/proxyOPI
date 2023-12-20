import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";
import { text } from "stream/consumers";

export default class PageOpenproxySpace {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies(protocol: Protocol): Promise<Proxy[]> {
        const proxyList = [];

        const textArea = await this.page.locator("xpath=//textarea[@class='text-input']").textContent();
        if (textArea !== null && textArea !== undefined && textArea !== "") {
            const proxyRows = textArea.split('\n');
            for (const proxyRow of proxyRows) {
                const proxyParts = proxyRow.split(':');
                const proxy: Proxy = { ip: proxyParts[0].trim(), port: proxyParts[1].trim(), anonymityLevel: AnonymityLevel.unknown, protocols: [protocol], sourceSite: this.sourceSite };

                proxyList.push(proxy);
            }
        }

        return proxyList;
    }
}