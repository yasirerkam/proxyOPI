import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";

export default class PageHideMyIo {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies(): Promise<Proxy[]> {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//div[@class="table_block"]/table/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ip: string = await proxyRow.locator(`xpath=//td[1]`).innerText();
            const port: string = await proxyRow.locator(`xpath=//td[2]`).innerText();
            const country: string | undefined = await proxyRow.locator(`xpath=//td[3]/span[@class="country"]`).innerText();
            const speed: string = await proxyRow.locator(`xpath=//td[4]/div`).innerText();
            const protocol: Protocol = this.transformProtocol(await proxyRow.locator(`xpath=//td[5]`).innerText());
            const anonimityLevel: AnonymityLevel = this.transformAnonymityLevel(await proxyRow.locator(`xpath=//td[6]`).innerText());
            const latestUpdate: string = await proxyRow.locator(`xpath=//td[7]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, anonymityLevel: anonimityLevel, protocols: [protocol], sourceSite: this.sourceSite, speed: speed, lastTested: latestUpdate };
            proxyList.push(proxy);
        }

        return proxyList;
    }

    transformProtocol(protocol: string): Protocol {
        switch (protocol.trim().toLowerCase()) {
            case "http":
                return Protocol.http;
            case "https":
                return Protocol.https;
            case "socks4":
                return Protocol.socks4;
            case "socks5":
                return Protocol.socks5;
            default:
                return Protocol.unknown;
        }
    }

    transformAnonymityLevel(anonymityLevel: string): AnonymityLevel {
        switch (anonymityLevel.trim().toLowerCase()) {
            case "low" || "no":
                return AnonymityLevel.transparent;
            case "average":
                return AnonymityLevel.anonymous;
            case "high":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}