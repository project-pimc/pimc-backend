import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from 'src/base.entity';

export enum PlotSize {
  FIVE_MARLA = '5 Marla',
  SEVEN_MARLA = '7 Marla',
  TEN_MARLA = '10 Marla',
  FOURTEEN_MARLA = '14 Marla',
  ONE_KANAL = '1 Kanal',
  TWO_KANAL = '2 Kanal',
}

export enum ReservationStatus {
  PENDING = 'Pending',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

@Entity('reservations')
export class Reservation extends BaseEntity {

  @Column({
    type: 'enum',
    enum: PlotSize,
    nullable: false,
  })
  plotSize: PlotSize;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ nullable: true })
  challanNumber: string;

  @Column({ nullable: true })
  paymentAmount: string;

  @Column({ nullable: true })
  bankDraftDate: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  nomineeName: string;

  @Column({ nullable: true })
  nomineeCnic: string;

  @Column({ nullable: true })
  nomineeRelationship: string;

  @Column({ nullable: true })
  nomineeAddress: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;

} 