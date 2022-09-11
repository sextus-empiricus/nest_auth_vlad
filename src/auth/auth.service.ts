import { AuthDto } from './dto';
import { DataSource } from 'typeorm';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensResponse } from '../types/auth';
import { UsersService } from '../users/users.service';
import { appConfig } from '../../config';
import { hash, compare } from 'bcrypt';

const { refreshSecret, authSecret } = appConfig.jwt;

@Injectable()
export class AuthService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      private usersService: UsersService,
      private jwtService: JwtService,
   ) {}

   async signupLocal(dto: AuthDto): Promise<TokensResponse> {
      const password = await hash(dto.password, 12);
      const { createdUserId } = await this.usersService.create({
         ...dto,
         password,
      });

      const tokens = await this.getTokens(createdUserId, dto.email);
      await this.updateRefreshTokenHash(createdUserId, tokens.refreshToken);
      return tokens;
   }

   async signinLocal(dto: AuthDto): Promise<TokensResponse> {
      const targetedUser = await this.usersService.findByEmail(dto.email);
      if (!targetedUser)
         throw new ForbiddenException('Incorrect email or password.');

      const passwordMatches = await compare(
         dto.password,
         targetedUser.password,
      );
      if (!passwordMatches) {
         throw new ForbiddenException('Incorrect email or password.');
      }
      const tokens = await this.getTokens(targetedUser.id, dto.email);
      await this.updateRefreshTokenHash(targetedUser.id, tokens.refreshToken);
      return tokens;
   }

   async logout(userId: string) {
      await this.usersService.updateById(userId, { refreshToken: null });
   }

   async refreshTokens(userId: string, refreshToken: string) {
      const targetedUser = await this.usersService.findById(userId);
      if (!targetedUser || refreshToken) {
         throw new ForbiddenException('Access denied');
      }
      const refreshTokensMatches = await compare(
         refreshToken,
         targetedUser.refreshToken,
      );
      if (!refreshTokensMatches) {
         throw new ForbiddenException('Access denied');
      }

      const tokens = await this.getTokens(targetedUser.id, targetedUser.email);
      await this.updateRefreshTokenHash(targetedUser.id, tokens.refreshToken);
      return tokens;
   }

   //utility fns():
   async updateRefreshTokenHash(
      userId: string,
      refreshToken: string,
   ): Promise<void> {
      await this.usersService.updateById(userId, {
         refreshToken: await hash(refreshToken, 12),
      });
   }

   async getTokens(userId: string, email: string): Promise<TokensResponse> {
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(
            {
               sub: userId,
               email,
            },
            {
               secret: authSecret,
               expiresIn: 60 * 15,
            },
         ),
         this.jwtService.signAsync(
            {
               sub: userId,
               email,
            },
            {
               secret: refreshSecret,
               expiresIn: 60 * 60 * 24 * 7,
            },
         ),
      ]);

      return {
         accessToken,
         refreshToken,
      };
   }
}
