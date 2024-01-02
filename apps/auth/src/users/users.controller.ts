import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindOneDto,
  PaginationDto,
  UpdateUserDto,
  usersServiceController,
  usersServiceControllerMethods,
} from '@app/common';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamCall } from '@nestjs/microservices';

@Controller()
@usersServiceControllerMethods()
export class UsersController implements usersServiceController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('usersService', 'createUser')
  createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @GrpcMethod('usersService', 'findAllUsers')
  findAllUsers() {
    return this.usersService.findAll();
  }

  @GrpcMethod('usersService', 'findOneUser')
  findOneUser(findOneDto: FindOneDto) {
    return this.usersService.findOne(findOneDto);
  }

  @GrpcMethod('usersService', 'updateUser')
  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @GrpcMethod('usersService', 'removeUser')
  removeUser(findOneDto: FindOneDto) {
    return this.usersService.remove(findOneDto);
  }

  @GrpcStreamCall('usersService', 'queryUsers')
  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(paginationDtoStream);
  }
}
