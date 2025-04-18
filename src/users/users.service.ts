import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    // Check if user with email already exists
    const existingUserByEmail = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if user with CNIC already exists
    const existingUserByCnic = await this.usersRepository.findOne({ 
      where: { cnic: createUserDto.cnic } 
    });
    if (existingUserByCnic) {
      throw new ConflictException('CNIC already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create new user
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.usersRepository.save(newUser);

    // Remove sensitive fields before returning
    const { password, refreshToken, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByCnic(cnic: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { cnic } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByPassportNumber(passportNumber: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { passportNumber } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { identifier, password } = loginUserDto;
    
    // Try to find user by email, cnic, or passportNumber
    const user = await this.usersRepository.findOne({ 
      where: [
        { email: identifier },
        { cnic: identifier },
        { passportNumber: identifier }
      ]
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    let hashedRefreshToken;
    
    if (refreshToken) {
      hashedRefreshToken = await this.hashPassword(refreshToken);
    }
    
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.findById(userId);
    
    if (!user || !user.refreshToken) {
      return false;
    }
    
    return this.comparePasswords(refreshToken, user.refreshToken);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 