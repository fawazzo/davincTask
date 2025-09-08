// backend/src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GeoDto { // <--- ADD export
  @IsString()
  @IsNotEmpty()
  lat: string;

  @IsString()
  @IsNotEmpty()
  lng: string;
}

export class AddressDto { // <--- ADD export
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  suite: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto;
}

export class CompanyDto { // <--- ADD export
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  catchPhrase: string;

  @IsString()
  @IsNotEmpty()
  bs: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}