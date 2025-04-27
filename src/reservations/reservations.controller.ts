import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReservationStatus } from './schemas/reservation.schema';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Reservation } from './schemas/reservation.schema';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ status: 201, description: 'Reservation created successfully', type: Reservation })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    const userId = req.user.id || req.user._id || req.user.sub;
    console.log('Creating reservation with userId:', userId);
    return this.reservationsService.create(userId, createReservationDto);
  }

  @ApiOperation({ summary: 'Get all reservations for current user' })
  @ApiResponse({ status: 200, description: 'Returns all reservations for the user', type: [Reservation] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const userId = req.user.id || req.user._id || req.user.sub;
    return this.reservationsService.findAllByUser(userId);
  }

  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Returns the reservation', type: Reservation })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update reservation status' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiParam({ name: 'status', description: 'New status', enum: ReservationStatus })
  @ApiResponse({ status: 200, description: 'Status updated successfully', type: Reservation })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: ReservationStatus,
  ) {
    return this.reservationsService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
} 