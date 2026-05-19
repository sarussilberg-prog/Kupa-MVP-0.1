import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiResponse, User, UpdateProfileDto } from '@cost-share/shared';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<ApiResponse<User[]>> {
        const users = await this.usersService.findAll();
        return { success: true, data: users };
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ApiResponse<User>> {
        const user = await this.usersService.findById(id);
        if (!user) return { success: false, error: 'User not found' };
        return { success: true, data: user };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProfileDto,
    ): Promise<ApiResponse<User>> {
        const user = await this.usersService.update(id, dto);
        if (!user) return { success: false, error: 'User not found' };
        return { success: true, data: user };
    }
}
