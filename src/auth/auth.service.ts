import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenResponse } from './interfaces/token-response.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<TokenResponse> {
    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokens(newUser.id, 0); // New users start with token version 0
    
    // Store refresh token in database
    await this.usersService.updateRefreshToken(newUser.id, tokens.refreshToken);
    
    return tokens;
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenResponse> {
    const user = await this.usersService.validateUser(loginUserDto);
    
    const tokens = await this.generateTokens(user.id, user.tokenVersion);
    
    // Store refresh token in database
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TokenResponse> {
    const isRefreshTokenValid = await this.usersService.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);
    const tokens = await this.generateTokens(userId, user.tokenVersion);
    
    // Update refresh token in database
    await this.usersService.updateRefreshToken(userId, tokens.refreshToken);
    
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    // Increment token version to invalidate all existing tokens
    await this.usersService.incrementTokenVersion(userId);
    // Clear refresh token
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, tokenVersion: number): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, tokenVersion),
      this.generateRefreshToken(userId, tokenVersion),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(userId: string, tokenVersion: number): Promise<string> {
    const payload: JwtPayload = { 
      sub: userId,
      tokenVersion
    };
    const secret = this.configService.get<string>('jwt.secret') || 'pimc_stronger_secret_key_that_is_at_least_256_bits_long_for_better_security_12345678';
    const expiresIn = this.configService.get<string>('jwt.accessTokenExpiration') || '7d';
    
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  private async generateRefreshToken(userId: string, tokenVersion: number): Promise<string> {
    const payload: JwtPayload = { 
      sub: userId,
      tokenVersion
    };
    const secret = this.configService.get<string>('jwt.secret') || 'pimc_stronger_secret_key_that_is_at_least_256_bits_long_for_better_security_12345678';
    const expiresIn = this.configService.get<string>('jwt.refreshTokenExpiration') || '14d';
    
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }
} 