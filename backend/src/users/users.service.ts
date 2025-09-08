// backend/src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Address, Company } from './interfaces/user.interface'; // Ensure Address and Company are imported if they are distinct interfaces. If they are just type aliases for AddressDto/CompanyDto, it's fine.
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: { lat: '-37.3159', lng: '81.1496' },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: { lat: '-43.9509', lng: '-34.4618' },
      },
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains',
      },
    },
  ];
  private nextId =
    this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      // Deep copy for nested objects, assuming createUserDto.address/company are always fully provided
      address: { ...createUserDto.address, geo: { ...createUserDto.address.geo } },
      company: { ...createUserDto.company },
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const existingUser = this.users[userIndex];

    // Create a new updated user object
    const updatedUser: User = {
      ...existingUser, // Start with all existing user properties
      ...updateUserDto, // Override top-level properties if they exist in updateUserDto
      // Now, handle nested objects for partial updates
      address: {
        ...existingUser.address, // Start with existing address properties
        ...(updateUserDto.address || {}), // If update has address, merge its top-level properties
        geo: {
          ...existingUser.address.geo, // Start with existing geo properties
          ...(updateUserDto.address?.geo || {}), // If update has address.geo, merge its properties
        },
      },
      company: {
        ...existingUser.company, // Start with existing company properties
        ...(updateUserDto.company || {}), // If update has company, merge its properties
      },
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number): void {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    if (this.users.length === initialLength) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}