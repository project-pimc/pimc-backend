import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { BaseEntity } from 'src/base.entity';

export enum UserCategory {
  CONSULTANT = 'Consultant',
  MEDICAL_OFFICER = 'Medical Officer',
  PARAMEDICAL = 'Paramedical Staff',
  NURSE = 'Nurse',
  NON_MEDICAL = 'Non-Medical',
  OVERSEAS = 'Overseas',
}

@Entity('users')
export class User extends BaseEntity {

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: true })
  fatherOrHusbandName: string;

  @Column({ unique: true, nullable: false })
  cnic: string;

  @Column({ nullable: true })
  passportNumber: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({
    type: 'enum',
    enum: UserCategory,
    default: UserCategory.MEDICAL_OFFICER,
  })
  category: UserCategory;

  @Column({ nullable: true })
  presentAddress: string;

  @Column({ nullable: true })
  permanentAddress: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

}