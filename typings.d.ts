import { Connection } from './src/configs/connection';
import { Crypto } from './src/configs/crypto';
import { Jwt } from './src/configs/jwt';

declare global {
    namespace Express {
        export interface Request {
            conn: Connection;
            crypto: Crypto;
            jwt: Jwt;
            hospcode: string;
            token: string;
            decoded: any;
        }
    }
}