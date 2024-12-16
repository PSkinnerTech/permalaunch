export declare class AbstractKyveLCDClient {
    private restEndpoint;
    protected request: (url: string, params?: Record<string, any>) => Promise<any>;
    constructor(restEndpoint: string);
}
