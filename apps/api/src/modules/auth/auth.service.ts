import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { OAuthLoginDto } from './dto/oauth-login.dto'
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface'

const REFRESH_TOKEN_EXPIRY_DAYS = 7
const ACCESS_TOKEN_EXPIRY = '15m'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async googleLogin(dto: OAuthLoginDto) {
    const googleUser = await this.fetchGoogleUser(dto.code, dto.redirectUri)
    return this.loginOrRegister(googleUser, 'google')
  }

  async kakaoLogin(dto: OAuthLoginDto) {
    const kakaoUser = await this.fetchKakaoUser(dto.code, dto.redirectUri)
    return this.loginOrRegister(kakaoUser, 'kakao')
  }

  async refresh(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRY,
    })
    return { accessToken }
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId)
  }

  private async loginOrRegister(
    profile: { email: string; name: string; providerId: string },
    provider: 'google' | 'kakao',
  ) {
    let user = await this.usersService.findByProvider(provider, profile.providerId)

    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        name: profile.name,
        provider,
        providerId: profile.providerId,
      })
    }

    const payload: JwtPayload = { sub: user.id, email: user.email }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRY,
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`,
    })

    const hash = await bcrypt.hash(refreshToken, 10)
    await this.usersService.updateRefreshToken(user.id, hash)

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, provider: user.provider },
    }
  }

  private async fetchGoogleUser(code: string, redirectUri: string) {
    // Google OAuth 토큰 교환 및 사용자 정보 조회
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID') as string,
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) throw new BadRequestException('OAUTH_CODE_INVALID')

    const tokens = (await tokenRes.json()) as { access_token: string }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) throw new UnauthorizedException('OAUTH_PROVIDER_ERROR')

    const info = (await userRes.json()) as { sub: string; email: string; name: string }
    return { providerId: info.sub, email: info.email, name: info.name }
  }

  private async fetchKakaoUser(code: string, redirectUri: string) {
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        client_id: this.configService.get<string>('KAKAO_CLIENT_ID') as string,
        client_secret: this.configService.get<string>('KAKAO_CLIENT_SECRET') as string,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) throw new BadRequestException('OAUTH_CODE_INVALID')

    const tokens = (await tokenRes.json()) as { access_token: string }

    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userRes.ok) throw new UnauthorizedException('OAUTH_PROVIDER_ERROR')

    const info = (await userRes.json()) as {
      id: number
      kakao_account: { email: string; profile: { nickname: string } }
    }

    return {
      providerId: String(info.id),
      email: info.kakao_account.email,
      name: info.kakao_account.profile.nickname,
    }
  }
}
