/**
 * Users Controller
 * Thin controller layer - delegates to service
 */

import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiResponse, User } from '@cost-share/shared';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): ApiResponse<User[]> {
        const users = this.usersService.findAll();
        return {
            success: true,
            data: users,
        };
    }

    @Get(':id')
    findById(@Param('id') id: string): ApiResponse<User> {
        const user = this.usersService.findById(id);
        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }
        return {
            success: true,
            data: user,
        };
    }
}
