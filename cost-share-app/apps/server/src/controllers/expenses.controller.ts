/**
 * Expenses Controller
 * HTTP endpoints for expense operations with split support
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExpensesService } from '../services/expenses.service';
import { ApiResponse, Expense, ExpenseSplit, CreateExpenseDto, UpdateExpenseDto } from '@cost-share/shared';

@Controller('api/expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    /**
     * GET /api/expenses
     * Get all expenses or filter by group
     */
    @Get()
    findAll(@Query('groupId') groupId?: string): ApiResponse<Expense[]> {
        let expenses: Expense[];

        if (groupId) {
            expenses = this.expensesService.findByGroupId(groupId);
        } else {
            expenses = this.expensesService.findAll();
        }

        return {
            success: true,
            data: expenses,
        };
    }

    /**
     * GET /api/expenses/:id
     * Get expense by ID
     */
    @Get(':id')
    findById(@Param('id') id: string): ApiResponse<Expense> {
        const expense = this.expensesService.findById(id);
        if (!expense) {
            return {
                success: false,
                error: 'Expense not found',
            };
        }
        return {
            success: true,
            data: expense,
        };
    }

    /**
     * POST /api/expenses
     * Create a new expense with splits
     */
    @Post()
    create(@Body() dto: CreateExpenseDto): ApiResponse<Expense> | ApiResponse<never> {
        // In a real app, get createdBy from authenticated user
        const createdBy = 'profile-1';
        const result = this.expensesService.create(dto, createdBy);

        if ('error' in result) {
            return {
                success: false,
                error: result.error,
            };
        }

        return {
            success: true,
            data: result,
            message: 'Expense created successfully',
        };
    }

    /**
     * PUT /api/expenses/:id
     * Update expense
     */
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateExpenseDto): ApiResponse<Expense> | ApiResponse<never> {
        const result = this.expensesService.update(id, dto);

        if (!result) {
            return {
                success: false,
                error: 'Expense not found',
            };
        }

        if ('error' in result) {
            return {
                success: false,
                error: result.error,
            };
        }

        return {
            success: true,
            data: result,
            message: 'Expense updated successfully',
        };
    }

    /**
     * DELETE /api/expenses/:id
     * Soft delete expense
     */
    @Delete(':id')
    delete(@Param('id') id: string): ApiResponse<void> {
        const success = this.expensesService.delete(id);
        if (!success) {
            return {
                success: false,
                error: 'Expense not found',
            };
        }
        return {
            success: true,
            message: 'Expense deleted successfully',
        };
    }

    /**
     * GET /api/expenses/:id/splits
     * Get splits for an expense
     */
    @Get(':id/splits')
    getSplits(@Param('id') id: string): ApiResponse<ExpenseSplit[]> {
        const splits = this.expensesService.getSplits(id);
        return {
            success: true,
            data: splits,
        };
    }

    /**
     * GET /api/expenses/:id/with-splits
     * Get expense with its splits
     */
    @Get(':id/with-splits')
    getExpenseWithSplits(@Param('id') id: string): ApiResponse<{ expense: Expense; splits: ExpenseSplit[] }> {
        const result = this.expensesService.getExpenseWithSplits(id);
        if (!result) {
            return {
                success: false,
                error: 'Expense not found',
            };
        }
        return {
            success: true,
            data: result,
        };
    }
}
