import log from "electron-log";
import ProxyChain from "proxy-chain";

type ProxyServerStatus = "stopped" | "running";

let server: any = undefined;
let upstreamProxyUrl: string | undefined = undefined;
let proxyServerEndpoint: string | undefined = undefined;
let status: ProxyServerStatus = "stopped";
let onStatusChangeCallback: ((status: ProxyServerStatus) => void) | undefined;

export const initializeProxyServer = (params: ProxyPreferenceType) => {
  log.debug("Proxy init params:", params);

  proxyServerEndpoint = `http://localhost:${params.port}`;
  log.debug("New proxy server endpoint:", proxyServerEndpoint);

  server = new ProxyChain.Server({
    port: params.port,
    verbose: params.verbose,
    prepareRequestFunction: () => {
      return {
        upstreamProxyUrl: upstreamProxyUrl,
      };
    },
  });

  log.info("Proxy server is initialized.");
};

export const listenProxyPort = () => {
  server?.listen(() => {
    log.info(`Proxy server is listening on port ${server.port}.`);
    status = "running";
    onStatusChangeCallback && onStatusChangeCallback("running");
  });
};

export const closePorxyPort = () => {
  server?.close(true, () => {
    log.info("Proxy server was closed.");
    status = "stopped";
    onStatusChangeCallback && onStatusChangeCallback("stopped");
  });
  server = null;
};

export const updateUpstreamProxyUrl = (params?: ConnectionSettingType) => {
  log.debug("Upstream URl update params:", params);

  if (params) {
    let credential: string = "";
    if (params?.credentials) {
      const user = encodeURI(params.credentials.user);
      const password = encodeURI(params.credentials.password);
      credential = `${user}:${password}@`;
    }
    upstreamProxyUrl = `http://${credential}${params.host}:${params.port}`;
  } else {
    upstreamProxyUrl = null;
  }
  log.debug("New upstream proxy URL:", upstreamProxyUrl);

  log.info("Upstream proxy URL is updated.");
};

export const getProxyServerEndpoint = (): string | undefined =>
  proxyServerEndpoint;

export const isProxyServerRunning = (): boolean => status == "running";

export const onProxyStatusDidChange = (
  callback: (status: ProxyServerStatus) => void
) => {
  onStatusChangeCallback = callback;
};
