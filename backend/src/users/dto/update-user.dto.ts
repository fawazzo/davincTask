// backend/src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, AddressDto, GeoDto, CompanyDto } from './create-user.dto';

import { IsOptional, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// 1. GeoUpdateDto: Manually defined partial version of GeoDto
export class GeoUpdateDto {
  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lng?: string;
}

// 2. AddressUpdateDto: Manually defined partial version of AddressDto,
//    with its 'geo' property explicitly set to use GeoUpdateDto
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
  geo?: GeoUpdateDto;
}

// 3. CompanyUpdateDto: Manually defined partial version of CompanyDto
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

// 4. UpdateUserDto: The final form that should work.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // To solve the TS2416 error, we *must* ensure that the type declared here
  // is fully assignable to what `Partial<CreateUserDto>` expects.
  // `Partial<CreateUserDto>` expects `address?: AddressDto` and `company?: CompanyDto`.
  // Our `AddressUpdateDto` is `Partial<AddressDto>`.
  // So, we need to explicitly declare the type as `Partial<AddressDto> | undefined`
  // for TypeScript's compiler, while still instructing `class-transformer`
  // to use our `AddressUpdateDto` class.

  // NestJS's `PartialType` *should* implicitly make the inherited types `Partial<T> | undefined`
  // for nested objects if `PartialType` was recursive. Since it's not,
  // we are stuck with `AddressDto | undefined` for the inherited field.
  // The only way to override `AddressDto | undefined` with `AddressUpdateDto`
  // (which is `Partial<AddressDto>`) is if `Partial<AddressDto>` is assignable to `AddressDto`.
  // This is fundamentally false (because `string | undefined` is not assignable to `string`).

  // The only truly compliant way is to make the explicitly declared types in UpdateUserDto
  // match the types from `Partial<CreateUserDto>`, which means `AddressDto` and `CompanyDto`.
  // BUT THEN, how do we get `class-transformer` to work with `AddressUpdateDto`?
  // We rely on the `@Type(() => AddressUpdateDto)` and `@ValidateNested()` decorators.
  // `class-transformer` will use `AddressUpdateDto` at runtime, while TypeScript
  // sees `AddressDto`. This is a common pattern in NestJS DTOs for partial updates.

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressUpdateDto) // <-- class-transformer uses AddressUpdateDto
  // The type for TypeScript's static analysis must match the inherited type from PartialType(CreateUserDto)
  // which is `AddressDto | undefined`. We're implicitly declaring it as `AddressDto | undefined` here
  // by simply putting `AddressDto` as the type and `@IsOptional()`.
  address?: AddressDto; // <-- TypeScript sees `AddressDto` (or `AddressDto | undefined` because of `?`)

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyUpdateDto) // <-- class-transformer uses CompanyUpdateDto
  company?: CompanyDto; // <-- TypeScript sees `CompanyDto` (or `CompanyDto | undefined` because of `?`)
}