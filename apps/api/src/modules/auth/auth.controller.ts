import {
  Controller,
  Post,
  Delete,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { Throttle } from '@nestjs/throttler'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { OAuthLoginDto } from './dto/oauth-login.dto'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator'

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  path: '/',
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('google')
  async googleLogin(@Body() dto: OAuthLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.googleLogin(dto)
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
    return { accessToken, user }
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('kakao')
  async kakaoLogin(@Body() dto: OAuthLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.kakaoLogin(dto)
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
    return { accessToken, user }
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: CurrentUserPayload,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { accessToken } = await this.authService.refresh(user.id, user.email)
    return { accessToken }
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: CurrentUserPayload, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.id)
    res.clearCookie('refresh_token', { path: '/' })
    return { message: '로그아웃되었습니다.' }
  }
}
