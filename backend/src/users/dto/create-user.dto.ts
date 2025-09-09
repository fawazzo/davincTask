// backend/src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// === GeoDto ===
export class GeoDto {
  @IsString()
  lat: string;

  @IsString()
  lng: string;
}

// === AddressDto ===
export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  suite: string;

  @IsString()
  city: string;

  @IsString()
  zipcode: string;

  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto; // GeoDto is still required if address is provided
}

// === CompanyDto ===
export class CompanyDto {
  @IsString()
  name: string;

  @IsString()
  catchPhrase: string;

  @IsString()
  bs: string;
}

// === CreateUserDto ===
export class CreateUserDto {
  @IsString()
  @IsNotEmpty() // Keep for truly mandatory fields
  name: string;

  @IsString()
  @IsNotEmpty() // Keep for truly mandatory fields
  username: string;

  @IsEmail()
  @IsNotEmpty() // Keep for truly mandatory fields
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto; // Address object itself is still mandatory

  @IsString()
  phone: string;

  @IsString()
  website: string;

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto; // Company object itself is still mandatory
}