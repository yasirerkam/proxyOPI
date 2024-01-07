
const enum Protocol { http = "http", https = "https", socks4 = "socks4", socks5 = "socks5", unknown = "unknown" }

const enum AnonymityLevel { transparent = "transparent", anonymous = "anonymous", elite = "elite", unknown = "unknown" }

type Proxy = { ip: string, port: string, protocols: Protocol[], sourceSite: string, anonymityLevel?: AnonymityLevel, lastTested?: string, country?: string, city?: string, isp?: string, speed?: string, uptime?: string, responseTime?: string, verified?: string, };

type ProxyList = { dateTime: number, list: Proxy[] };

export { Protocol, AnonymityLevel, Proxy, ProxyList };