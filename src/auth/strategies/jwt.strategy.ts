import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'pimc_super_secret_key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      console.log('JWT payload:', payload);
      const user = await this.usersService.findById(payload.sub);
      
      const { password, refreshToken, ...result } = user;
      const userToReturn = { ...result, _id: payload.sub, id: payload.sub };
      console.log('User for request:', userToReturn);
      return userToReturn;
    } catch (error) {
      console.error('JWT validation error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
} 