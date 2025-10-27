import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region?: string | null;

  @Column({ type: 'bigint' })
  population!: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency_code?: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  exchange_rate?: number | null;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  estimated_gdp?: number | null;

  @Column({ type: 'text', nullable: true })
  flag_url?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  last_refreshed_at?: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
