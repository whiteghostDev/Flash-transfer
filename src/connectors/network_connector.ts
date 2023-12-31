import { AbstractConnector } from '@web3-react/abstract-connector';
import { ConnectorUpdate } from '@web3-react/types';
import invariant from 'tiny-invariant';
import RequestError from './request_error';
// taken from ethers.js, compatible interface with web3 provider
type AsyncSendable = {
    isMetaMask?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (request: any, callback: (error: any, response: any) => void) => void;
    send?: (request: any, callback: (error: any, response: any) => void) => void;
  };
  interface BatchItem {
    request: { jsonrpc: '2.0'; id: number; method: string; params: unknown };
    resolve: (result: any) => void;
    reject: (error: Error) => void;
  }
export class MiniRpcProvider implements AsyncSendable {
    public readonly isMetaMask: false = false;
    public readonly chainId: number;

    public readonly url: string;

    public readonly host: string;

    public readonly path: string;

    public readonly batchWaitTimeMs: number;

    private readonly connector: NetworkConnector;

    private nextId = 1;
    private batchTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private batch: BatchItem[] = [];

  constructor(connector: NetworkConnector, chainId: number, url: string, batchWaitTimeMs?: number) {
    this.connector = connector;
    this.chainId = chainId;
    this.url = url;
    const parsed = new URL(url);
    this.host = parsed.host;
    this.path = parsed.pathname;
    // how long to wait to batch calls
    this.batchWaitTimeMs = batchWaitTimeMs ?? 50;
  }

  public readonly clearBatch = async () => {
    // eslint-disable-next-line no-console
    console.debug('Clearing batch', this.batch);
    let { batch } = this;

    batch = batch.filter((b) => {
      if (b.request.method === 'wallet_switchEthereumChain') {
        try {
          this.connector.changeChainId(parseInt((b.request.params as [{ chainId: string }])[0].chainId, 10));
          b.resolve({ id: b.request.id });
        } catch (error: any) {
          b.reject(error);
        }
        return false;
      }
      return true;
    });

    this.batch = [];
    this.batchTimeoutId = null;
    let response: Response;
    try {
      response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(batch.map((item) => item.request)),
      });
    } catch (error) {
      batch.forEach(({ reject }) => reject(new Error('Failed to send batch call')));
      return;
    }

    if (!response.ok) {
      batch.forEach(({ reject }) => reject(new RequestError(`${response.status}: ${response.statusText}`, -32000)));
      return;
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      batch.forEach(({ reject }) => reject(new Error('Failed to parse JSON response')));
      return;
    }
    const byKey = batch.reduce<{ [id: number]: BatchItem }>((memo, current) => {
      // eslint-disable-next-line no-param-reassign
      memo[current.request.id] = current;
      return memo;
    }, {});
    // eslint-disable-next-line no-restricted-syntax
    for (const result of json) {
      const {
        resolve,
        reject,
        request: { method },
      } = byKey[result.id];
      if ('error' in result) {
        reject(new RequestError(result?.error?.message, result?.error?.code, result?.error?.data));
      } else if ('result' in result && resolve) {
        resolve(result.result);
      } else {
        reject(new RequestError(`Received unexpected JSON-RPC response to ${method} request.`, -32000, result));
      }
    }
  };

  public readonly sendAsync = (
    request: {
      jsonrpc: '2.0';
      id: number | string | null;
      method: string;
      params?: unknown[] | Record<string, unknown>;
    },
    callback: (error: any, response: any) => void
  ): void => {
    this.request(request.method, request.params)
      .then((result) => callback(null, { jsonrpc: '2.0', id: request.id, result }))
      .catch((error) => callback(error, null));
  };

  public readonly request = async (
    method: string | { method: string; params: unknown[] },
    params?: unknown[] | Record<string, unknown>
  ): Promise<unknown> => {
    if (typeof method !== 'string') {
      return this.request(method.method, method.params);
    }
    if (method === 'eth_chainId') {
      return `0x${this.chainId.toString(16)}`;
    }
    const promise = new Promise((resolve, reject) => {
      this.batch.push({
        request: {
          jsonrpc: '2.0',
          // eslint-disable-next-line no-plusplus
          id: this.nextId++,
          method,
          params,
        },
        resolve,
        reject,
      });
    });
    this.batchTimeoutId = this.batchTimeoutId ?? setTimeout(this.clearBatch, this.batchWaitTimeMs);
    return promise;
  };
}
interface NetworkConnectorArguments {
    urls: { [chainId: number]: string };
    defaultChainId?: number;
  }
export class NetworkConnector extends AbstractConnector {
    private readonly providers: { [chainId: number]: MiniRpcProvider };
    private currentChainId: number;
    constructor({ urls, defaultChainId }: NetworkConnectorArguments) {
        invariant(defaultChainId || Object.keys(urls).length === 1, 'defaultChainId is a required argument with >1 url');
        super({
          supportedChainIds: Object.keys(urls).map((k): number => Number(k)),
        });
    
        this.currentChainId = defaultChainId ?? Number(Object.keys(urls)[0]);
        this.providers = Object.keys(urls).reduce<{
          [chainId: number]: MiniRpcProvider;
        }>((accumulator, chainId) => {
          // eslint-disable-next-line no-param-reassign
          accumulator[Number(chainId)] = new MiniRpcProvider(this, Number(chainId), urls[Number(chainId)]);
          return accumulator;
        }, {});
      }
    
      public get provider(): MiniRpcProvider {
        return this.providers[this.currentChainId];
      }
      public async activate(): Promise<ConnectorUpdate> {
        return {
          provider: this.providers[this.currentChainId],
          chainId: this.currentChainId,
          account: null,
        };
      }
    
      public async getProvider(): Promise<MiniRpcProvider> {
        return this.providers[this.currentChainId];
      }
    
      public async getChainId(): Promise<number> {
        return this.currentChainId;
      }
    
      // eslint-disable-next-line class-methods-use-this
      public async getAccount(): Promise<null> {
        return null;
      }
    
      // eslint-disable-next-line class-methods-use-this
      public deactivate(): void {}
    
      /**
       * Meant to be called only by MiniRpcProvider
       * @param chainId the new chain id
       */
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      public changeChainId(chainId: number) {
        if (chainId in this.providers) {
          this.currentChainId = chainId;
          this.emitUpdate({
            chainId,
            account: null,
            provider: this.providers[chainId],
          });
        } else {
          throw new Error(`Unsupported chain ID: ${chainId}`);
        }
      }
    
}