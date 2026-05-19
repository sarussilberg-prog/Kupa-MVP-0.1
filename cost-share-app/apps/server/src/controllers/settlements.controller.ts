/**
 * Settlements Controller
 * HTTP endpoints for settlement operations (debt payments)
 */

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SettlementsService } from '../services/settlements.service';
import { CreateSettlementDto } from '@cost-share/shared';

@Controller('settlements')
export class SettlementsController {
    constructor(private settlementsService: SettlementsService) { }

    /**
     * GET /api/settlements
     * Get all settlements or filter by group
     */
    @Get()
    getSettlements(@Query('groupId') groupId?: string) {
        if (groupId) {
            return this.settlementsService.findByGroup(groupId);
        }
        return this.settlementsService.findAll();
    }

    /**
     * GET /api/settlements/:id
     * Get settlement by ID
     */
    @Get(':id')
    getSettlement(@Param('id') id: string) {
        return this.settlementsService.findById(id);
    }

    /**
     * POST /api/settlements
     * Create a new settlement
     */
    @Post()
    createSettlement(@Body() dto: CreateSettlementDto) {
        // In a real app, createdBy would come from auth token
        const createdBy = dto.fromUserId; // Temporary: assume creator is the payer
        return this.settlementsService.create(dto, createdBy);
    }

    /**
     * GET /api/settlements/user/:userId
     * Get settlements for a specific user
     */
    @Get('user/:userId')
    getUserSettlements(@Param('userId') userId: string) {
        return this.settlementsService.findByUser(userId);
    }

    /**
     * GET /api/settlements/history/:groupId/:userId1/:userId2
     * Get settlement history between two users in a group
     */
    @Get('history/:groupId/:userId1/:userId2')
    getSettlementHistory(
        @Param('groupId') groupId: string,
        @Param('userId1') userId1: string,
        @Param('userId2') userId2: string
    ) {
        return this.settlementsService.getSettlementHistory(groupId, userId1, userId2);
    }
}
