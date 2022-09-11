import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../../config';
import { Injectable } from '@nestjs/common';

const { authSecret } = appConfig.jwt;

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: authSecret,
      });
   }

   validate(payload: any) {
      return payload;
   }
}
