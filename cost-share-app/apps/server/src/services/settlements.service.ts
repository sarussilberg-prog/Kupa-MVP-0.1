/**
 * Settlements Service
 * Business logic for settlement operations (debt payments)
 */

import { Injectable } from '@nestjs/common';
import { Settlement, CreateSettlementDto } from '@cost-share/shared';
import { settlements, profiles } from '../data/mock-data';
import { generateId } from '@cost-share/shared';
import { CalculationsService } from './calculations.service';

@Injectable()
export class SettlementsService {
    constructor(private calculationsService: CalculationsService) { }

    /**
     * Get all settlements
     */
    findAll(): Settlement[] {
        return settlements;
    }

    /**
     * Get settlement by ID
     */
    findById(id: string): Settlement | undefined {
        return settlements.find(s => s.id === id);
    }

    /**
     * Get settlements by group
     */
    findByGroup(groupId: string): Settlement[] {
        return settlements.filter(s => s.groupId === groupId);
    }

    /**
     * Get settlements by user (either from or to)
     */
    findByUser(userId: string): Settlement[] {
        return settlements.filter(s =>
            s.fromUserId === userId || s.toUserId === userId
        );
    }

    /**
     * Create a new settlement
     * Validates the settlement amount before creating
     */
    create(dto: CreateSettlementDto, createdBy: string): Settlement | { error: string } {
        // Validate settlement
        const validation = this.calculationsService.validateSettlement(
            dto.groupId,
            dto.fromUserId,
            dto.toUserId,
            dto.amount
        );

        if (!validation.valid) {
            return { error: validation.message || 'Invalid settlement' };
        }

        // Ensure users exist
        const fromUser = profiles.find(p => p.id === dto.fromUserId);
        const toUser = profiles.find(p => p.id === dto.toUserId);

        if (!fromUser || !toUser) {
            return { error: 'User not found' };
        }

        // Create settlement
        const newSettlement: Settlement = {
            id: generateId(),
            groupId: dto.groupId,
            fromUserId: dto.fromUserId,
            toUserId: dto.toUserId,
            amount: dto.amount,
            currency: dto.currency,
            settlementDate: dto.settlementDate || new Date(),
            paymentMethod: dto.paymentMethod,
            createdBy,
            createdAt: new Date(),
        };

        settlements.push(newSettlement);
        return newSettlement;
    }

    /**
     * Get settlement history between two users in a group
     */
    getSettlementHistory(groupId: string, userId1: string, userId2: string): Settlement[] {
        return settlements.filter(s =>
            s.groupId === groupId &&
            ((s.fromUserId === userId1 && s.toUserId === userId2) ||
                (s.fromUserId === userId2 && s.toUserId === userId1))
        );
    }
}
