import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    try {
      // Find the user by ID
      const user = await this.usersService.findById(userId);

      // Create new reservation with the user's ID
      const newReservation = new this.reservationModel({
        ...createReservationDto,
        status: ReservationStatus.PENDING,
        user: user._id,
      });

      const savedReservation = await newReservation.save();
      return savedReservation;
    } catch (error) {
      console.error('Error creating reservation:', error.message);
      throw error;
    }
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().populate('user').exec();
  }

  async findAllByUser(userId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ user: userId }).populate('user').exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).populate('user').exec();

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.reservationModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('user').exec();
    
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    
    return reservation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }
} 