import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../../config';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

const { refreshSecret } = appConfig.jwt;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
   Strategy,
   'jwt-refresh',
) {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: refreshSecret,
         passReqToCallback: true,
      });
   }

   validate(req: Request, payload: any) {
      const refreshToken = req
         .get('authorization')
         .replace('Bearer', '')
         .trim();
      return {
         ...payload,
         refreshToken,
      };
   }
}
