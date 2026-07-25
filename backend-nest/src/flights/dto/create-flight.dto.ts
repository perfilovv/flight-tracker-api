import { IsString, IsISO8601, Length } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @Length(2, 10)
  flightNumber!: string;

  @IsString()
  @Length(3, 3)
  origin!: string;

  @IsString()
  @Length(3, 3)
  destination!: string;

  @IsISO8601()
  departureTime!: string;

  @IsISO8601()
  arrivalTime!: string;
}
