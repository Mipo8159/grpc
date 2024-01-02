import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  FindOneDto,
  PaginationDto,
  UpdateUserDto,
  User,
  Users,
} from '@app/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i <= 100; i++) {
      this.create({ username: randomUUID(), password: randomUUID(), age: 0 });
    }
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne({ id }: FindOneDto): User {
    return this.users.find((usr) => usr.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const index = this.users.findIndex((usr) => usr.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updateUserDto };
      return this.users[index];
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  remove({ id }: FindOneDto): User {
    const user = this.users.find((usr) => usr.id === id);
    if (user) {
      this.users.filter((usr) => usr.id === id);
      return user;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  queryUsers(
    paginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip),
      });
    };

    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
