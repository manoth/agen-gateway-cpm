import * as request from 'request-promise';

export class Request {

    getData(gatewayUri: string, token: string, hospcode: string, payload: any) {
        return this.gateway(gatewayUri, 'getData', token, hospcode, payload);
    }

    postData(gatewayUri: string, token: string, hospcode: string, payload: any) {
        return this.gateway(gatewayUri, 'postData', token, hospcode, payload);
    }

    gateway(gatewayUri: string, rounte: string, token: string, hospcode: string, payload: any) {
        const his = process.env.HIS;
        const dbType = process.env.DB_TYPE;
        return request.post({
            uri: `${gatewayUri}/${rounte}/${hospcode}/${his}/${dbType}`,
            auth: { 'bearer': token },
            body: { data: payload },
            json: true
        });
    }

}