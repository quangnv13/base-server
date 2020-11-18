import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IHttpResult } from 'src/shared/http-result';
import { UserDto } from 'src/shared/models/user';
import { ParseJsonPipe } from 'src/shared/pipes/json-parse.pipe';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  /**
   *
   */
  constructor(private userService: UserService) {}
  @Get('get-all')
  async getAllUser(
    @Query('filter', ParseJsonPipe) filter: UserDto,
    @Query('sort', ParseJsonPipe) sort,
    @Query('pageActive', ParseIntPipe) pageActive: number,
    @Query('pageSize', ParseIntPipe) pageSize,
  ): Promise<IHttpResult> {
    return await this.userService.findAll(filter, sort, pageActive, pageSize);
  }

  @Post('create')
  async createUser(@Body() userDto: UserDto): Promise<IHttpResult> {
    return await this.userService.createUser(userDto);
  }

  @Put('update')
  async updateUser(@Body() userDto: UserDto): Promise<IHttpResult> {
    return await this.userService.updateUser(userDto);
  }

  @Delete('delete')
  async deleteUser(userId: string): Promise<IHttpResult> {
    return await this.userService.deleteUser(userId);
  }
}
