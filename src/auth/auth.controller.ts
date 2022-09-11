import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { TokensResponse } from '../types/auth';
import { AccessTokenGuard, RefreshTokenGuard } from '../guards';
import { GetCurrentUser, PublicRoute } from '../decorators';
import { Payload } from '../types/auth/auth';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @PublicRoute()
   @Post('/local/signup')
   @HttpCode(HttpStatus.CREATED)
   async signupLocal(@Body() dto: AuthDto): Promise<TokensResponse> {
      return await this.authService.signupLocal(dto);
   }

   @PublicRoute()
   @Post('/local/signin')
   @HttpCode(HttpStatus.OK)
   async signinLocal(@Body() dto: AuthDto): Promise<TokensResponse> {
      return await this.authService.signinLocal(dto);
   }

   @Post('/logout')
   @HttpCode(HttpStatus.CREATED)
   async logout(@GetCurrentUser() user: Payload) {
      const { sub: id } = user;
      await this.authService.logout(id);
   }

   @PublicRoute()
   @UseGuards(RefreshTokenGuard)
   @Post('/local/refresh')
   @HttpCode(HttpStatus.CREATED)
   async refreshTokens(@GetCurrentUser() user: any) {
      console.log(user);
      const { sub: id, refreshToken } = user;
      await this.authService.refreshTokens(id, refreshToken);
   }
}
