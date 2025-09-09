// backend/src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, AddressDto, GeoDto, CompanyDto } from './create-user.dto';

import { IsOptional, ValidateNested, IsString, IsNumber } from 'class-validator'; // Added IsNumber
import { Type } from 'class-transformer';

// === GeoUpdateDto ===
export class GeoUpdateDto {
  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lng?: string;
}

// === AddressUpdateDto ===
export class AddressUpdateDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  suite?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoUpdateDto)
  geo?: GeoUpdateDto; // 'geo' object itself is optional
}

// === CompanyUpdateDto ===
export class CompanyUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  catchPhrase?: string;

  @IsOptional()
  @IsString()
  bs?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNumber()
  id?: number; // Add this if your frontend sends 'id' in the payload for PUT

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressUpdateDto)
  address?: AddressDto; // TS sees AddressDto | undefined, runtime uses AddressUpdateDto

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyUpdateDto)
  company?: CompanyDto;
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional() // Already handled by PartialType
  @IsString()
  website?: string;

}