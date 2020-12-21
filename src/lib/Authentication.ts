import { Injectable, Res } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { StandardLoginDto, StandardRegisterDto } from 'src/dtos/authentication.dto';
import { ApiResponse, ResponseDto } from 'src/dtos/response.dto';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';
import Crypto from 'src/utilities/crypto';
import Language from './Language';
const jwt = require('jsonwebtoken');

export enum TokenType {
    REFRESH_TOKEN = 'Refresh Token',
    ACCESS_TOKEN = 'Access Token',
}

export interface ValidatedToken {
    type: TokenType;
    user: User;
}

@Injectable()
export class Authentication {

    private googleClient: OAuth2Client;

    constructor() {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    public async verifyGoogleIdToken(idToken: string) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log(payload);
    }

    public async createStandardUser(req: StandardRegisterDto) {
        const user = new User();
        user.organizations = [];

        const errors = {};

        if (await User.findOne({where: {email: req.email}})) {
            errors['email'] = Language.EMAIL_EXISTS;
        }

        if (req.password.length < 8) {
            errors['password'] = Language.INVALID_PASSWORD;
        }

        if (req.organizationId) {
            const org = await Organization.findOne(req.organizationId);
            if (!org) {
                errors['organizationId'] = Language.ORGANIZATION_404;
            }

            user.organizations.push(org);
        }

        if (Object.keys(errors).length > 0) {
            return ResponseDto.Error(errors);
        }

        
        user.email = req.email;
        user.name = req.name;

        user.password = Crypto.getEncoded(
            Crypto.hash(Crypto.getBufferFromText(req.password))
        );

        await user.save();

        return ResponseDto.Success(user);

    }

    public async verifyStandardUser(req: StandardLoginDto): Promise<ApiResponse<User, string>> {
        const user = await User.findOne({
            where: {
                email: req.email,
            }
        })

        if (!user) return ResponseDto.Error(Language.INVALID_LOGIN);

        if (!Crypto.compare(
            Crypto.hash(Crypto.getBufferFromText(req.password)), 
            Crypto.getBufferFromEncoded(user.password))
         ) {
            return ResponseDto.Error(Language.INVALID_LOGIN);
        }

        return ResponseDto.Success(user);
    }

    public static async generateAccessToken(user: User) {
        return new Promise<string>((res, rej) => {
            jwt.sign({
                data: {
                    userId: user.id,
                }
            }, process.env.APP_SECRET, {
                expiresIn: parseInt(process.env.ACCESS_TOKEN_DUR),
                subject: TokenType.ACCESS_TOKEN, 
            }, (err, token) => {
                console.log(err, token)
                if (err) rej(err);
                else res(token);
            })
        });
    }

    public static async generateRefreshToken(user: User) {
        return new Promise<string>((res, rej) => {
            jwt.sign({
                data: {
                    userId: user.id,
                }
            }, process.env.APP_SECRET, {
                expiresIn: parseInt(process.env.REFRESH_TOKEN_DUR),
                subject: TokenType.REFRESH_TOKEN,
            },
            (err, token) => {
                if (err) rej(err);
                else res(token);
            })
        });
    }

    public static async validateToken(token: string): Promise<ValidatedToken> {
        return new Promise<ValidatedToken>((res, rej) => {
            jwt.verify(token, process.env.APP_SECRET, async (err, decoded) => {
                if (err) rej(err);
                res({
                    type: decoded.sub,
                    user: await User.findOneOrFail(decoded.data.userId)
                });
            })
        })
    }
}