/**
 * Groups Controller
 * Thin controller layer - delegates to service
 */

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GroupsService } from '../services/groups.service';
import { ApiResponse, Group, CreateGroupDto } from '@cost-share/shared';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Get()
    findAll(): ApiResponse<Group[]> {
        const groups = this.groupsService.findAll();
        return {
            success: true,
            data: groups,
        };
    }

    @Get(':id')
    findById(@Param('id') id: string): ApiResponse<Group> {
        const group = this.groupsService.findById(id);
        if (!group) {
            return {
                success: false,
                error: 'Group not found',
            };
        }
        return {
            success: true,
            data: group,
        };
    }

    @Post()
    create(@Body() dto: CreateGroupDto): ApiResponse<Group> {
        // In a real app, get createdBy from authenticated user
        const createdBy = 'user-1';
        const group = this.groupsService.create(dto, createdBy);
        return {
            success: true,
            data: group,
            message: 'Group created successfully',
        };
    }
}
