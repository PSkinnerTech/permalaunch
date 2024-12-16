/// <reference types="node" />
import EventEmitter from "events";
export interface IEthereumProvider extends EventEmitter {
    readonly chainId: string | null;
    readonly networkVersion: string | null;
    readonly selectedAddress: string | null;
    readonly isKeplr: boolean;
    readonly isMetaMask: boolean;
    isConnected(): boolean;
    request<T = unknown>({ method, params, chainId, }: {
        method: string;
        params?: readonly unknown[] | Record<string, unknown>;
        chainId?: string;
    }): Promise<T>;
    enable(): Promise<string[]>;
    net_version(): Promise<string>;
}
