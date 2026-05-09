import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface'
import { UsersService } from '../../users/users.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['refresh_token'] ?? null,
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.['refresh_token']
    if (!refreshToken) throw new UnauthorizedException('REFRESH_TOKEN_INVALID')

    const user = await this.usersService.findById(payload.sub)
    if (!user?.refreshTokenHash) throw new UnauthorizedException('REFRESH_TOKEN_INVALID')

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash)
    if (!isValid) throw new UnauthorizedException('REFRESH_TOKEN_INVALID')

    return { id: payload.sub, email: payload.email }
  }
}
