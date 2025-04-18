import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    const user = await this.usersService.findById(userId);

    const newReservation = this.reservationsRepository.create({
      ...createReservationDto,
      status: ReservationStatus.PENDING,
      user,
    });

    return this.reservationsRepository.save(newReservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['user'],
    });
  }

  async findAllByUser(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    reservation.status = status;
    
    return this.reservationsRepository.save(reservation);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }
} 