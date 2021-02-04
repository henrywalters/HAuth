import * as crypto from 'crypto';

export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

export default class Crypto {
    public static async randomBuffer(length: number): Promise<Buffer> {
        return new Promise<Buffer>((res, rej) => {
            crypto.randomBytes(length, (err, buffer) => {
                if (err) rej(err);
                res(buffer);
            })
        })
    }

    public static async generateKeyPair(): Promise<KeyPair> {
        return new Promise<KeyPair>((res, rej) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: process.env.APP_SECRET
                }
            }, (err, pub, priv) => {
                if (err) rej(err);
                else res({privateKey: priv, publicKey: pub});
            })
        })
    }

    public static hash(buffer: Buffer): Buffer {
        return crypto.createHmac(process.env.CRYPTO_ALGORITHM, process.env.APP_SECRET)
            .update(buffer)
            .digest();
    }

    public static compare(bufferA: Buffer, bufferB: Buffer): Boolean {
        return this.bufferEquals(bufferA, bufferB);
    }

    public static bufferEquals(bufferA: Buffer, bufferB: Buffer): Boolean {
        if (bufferA.length !== bufferB.length) return false;
        for (let i = 0; i < bufferA.length; i++) {
            if (bufferA[i] !== bufferB[i]) return false;
        }
        return true;
    }

    public static getBufferFromText(str: string): Buffer {
        return Buffer.from(str, process.env.TEXT_ENCODING as BufferEncoding);
    }

    public static getBufferFromEncoded(str: string): Buffer {
        return Buffer.from(str, process.env.CRYPTO_ENCODING as BufferEncoding);
    }

    public static getEncoded(buffer: Buffer) {
        return buffer.toString(process.env.CRYPTO_ENCODING as BufferEncoding);
    }

    public static getText(buffer: Buffer) {
        return buffer.toString(process.env.TEXT_ENCODING as BufferEncoding);
    }
}