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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { IHttpResult } from 'src/shared/http-result';
import { UserDto } from 'src/shared/models/user';
import { ParseJsonPipe } from 'src/shared/pipes/json-parse.pipe';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  /**
   *
   */
  constructor(private userService: UserService) {}
  @Get('get-all')
  @Roles('admin')
  async getAllUser(
    @Query('filter', ParseJsonPipe) filter: UserDto,
    @Query('sort', ParseJsonPipe) sort,
    @Query('pageActive', ParseIntPipe) pageActive: number,
    @Query('pageSize', ParseIntPipe) pageSize,
  ): Promise<IHttpResult> {
    return await this.userService.findAll(filter, sort, pageActive, pageSize);
  }

  @Post('create')
  @Roles('admin')
  async createUser(@Body() userDto: UserDto): Promise<IHttpResult> {
    return await this.userService.createUser(userDto);
  }

  @Put('update')
  @Roles('admin')
  async updateUser(@Body() userDto: UserDto): Promise<IHttpResult> {
    return await this.userService.updateUser(userDto);
  }

  @Delete('delete')
  @Roles('admin')
  async deleteUser(userId: string): Promise<IHttpResult> {
    return await this.userService.deleteUser(userId);
  }
}
