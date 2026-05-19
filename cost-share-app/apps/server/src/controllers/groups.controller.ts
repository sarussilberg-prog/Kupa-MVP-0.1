/**
 * Groups Controller
 * HTTP endpoints for group operations
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { GroupsService } from '../services/groups.service';
import { CalculationsService } from '../services/calculations.service';
import {
    ApiResponse,
    Group,
    GroupMember,
    CreateGroupDto,
    UpdateGroupDto,
    GroupSummary,
    UserBalance,
    DebtSummary
} from '@cost-share/shared';

@Controller('groups')
export class GroupsController {
    constructor(
        private readonly groupsService: GroupsService,
        private readonly calculationsService: CalculationsService
    ) { }

    /**
     * GET /api/groups
     * Get all groups
     */
    @Get()
    findAll(): ApiResponse<Group[]> {
        const groups = this.groupsService.findAll();
        return {
            success: true,
            data: groups,
        };
    }

    /**
     * GET /api/groups/:id
     * Get group by ID
     */
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

    /**
     * POST /api/groups
     * Create a new group
     */
    @Post()
    create(@Body() dto: CreateGroupDto): ApiResponse<Group> {
        // In a real app, get createdBy from authenticated user
        const createdBy = 'profile-1';
        const group = this.groupsService.create(dto, createdBy);
        return {
            success: true,
            data: group,
            message: 'Group created successfully',
        };
    }

    /**
     * PUT /api/groups/:id
     * Update group
     */
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateGroupDto): ApiResponse<Group> {
        const group = this.groupsService.update(id, dto);
        if (!group) {
            return {
                success: false,
                error: 'Group not found',
            };
        }
        return {
            success: true,
            data: group,
            message: 'Group updated successfully',
        };
    }

    /**
     * DELETE /api/groups/:id
     * Soft delete group
     */
    @Delete(':id')
    delete(@Param('id') id: string): ApiResponse<void> {
        const success = this.groupsService.delete(id);
        if (!success) {
            return {
                success: false,
                error: 'Group not found',
            };
        }
        return {
            success: true,
            message: 'Group deleted successfully',
        };
    }

    /**
     * GET /api/groups/:id/members
     * Get group members
     */
    @Get(':id/members')
    getMembers(@Param('id') id: string): ApiResponse<GroupMember[]> {
        const members = this.groupsService.getMembers(id);
        return {
            success: true,
            data: members,
        };
    }

    /**
     * POST /api/groups/:id/members
     * Add member to group
     */
    @Post(':id/members')
    addMember(@Param('id') id: string, @Body() dto: { userId: string }): ApiResponse<GroupMember> {
        const member = this.groupsService.addMember({
            groupId: id,
            userId: dto.userId,
        });
        return {
            success: true,
            data: member,
            message: 'Member added successfully',
        };
    }

    /**
     * DELETE /api/groups/:id/members/:userId
     * Remove member from group
     */
    @Delete(':id/members/:userId')
    removeMember(@Param('id') id: string, @Param('userId') userId: string): ApiResponse<void> {
        const success = this.groupsService.removeMember(id, userId);
        if (!success) {
            return {
                success: false,
                error: 'Member not found',
            };
        }
        return {
            success: true,
            message: 'Member removed successfully',
        };
    }

    /**
     * GET /api/groups/:id/balances
     * Get user balances in group
     */
    @Get(':id/balances')
    getBalances(@Param('id') id: string, @Query('userId') userId?: string): ApiResponse<UserBalance[]> {
        const balances = this.calculationsService.calculateUserBalances(id, userId);
        return {
            success: true,
            data: balances,
        };
    }

    /**
     * GET /api/groups/:id/debts
     * Get simplified debts (who owes whom)
     */
    @Get(':id/debts')
    getDebts(@Param('id') id: string): ApiResponse<DebtSummary[]> {
        const debts = this.calculationsService.getWhoOwesWhom(id);
        return {
            success: true,
            data: debts,
        };
    }

    /**
     * GET /api/groups/:id/summary
     * Get group summary statistics
     */
    @Get(':id/summary')
    getSummary(@Param('id') id: string): ApiResponse<GroupSummary> {
        const summary = this.calculationsService.calculateGroupSummary(id);
        if (!summary) {
            return {
                success: false,
                error: 'Group not found',
            };
        }
        return {
            success: true,
            data: summary,
        };
    }
}
