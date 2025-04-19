import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUserByEmail = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if user with CNIC already exists
    const existingUserByCnic = await this.userModel.findOne({ cnic: createUserDto.cnic });
    if (existingUserByCnic) {
      throw new ConflictException('CNIC already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create new user
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await createdUser.save();

    // Convert to plain object and exclude sensitive fields
    const user = createdUser.toObject();
    delete (user as any).password;
    delete (user as any).refreshToken;
    
    return user as User;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByCnic(cnic: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ cnic });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByPassportNumber(passportNumber: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ passportNumber });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const { identifier, password } = loginUserDto;
    
    // Try to find user by email, cnic, or passportNumber
    const user = await this.userModel.findOne({ 
      $or: [
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
    
    await this.userModel.findByIdAndUpdate(userId, {
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