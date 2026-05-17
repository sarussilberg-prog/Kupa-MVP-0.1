/**
 * Expenses Controller
 * Thin controller layer - delegates to service
 */

import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ExpensesService } from '../services/expenses.service';
import { ApiResponse, Expense, CreateExpenseDto } from '@cost-share/shared';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

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

    @Post()
    create(@Body() dto: CreateExpenseDto): ApiResponse<Expense> {
        const expense = this.expensesService.create(dto);
        return {
            success: true,
            data: expense,
            message: 'Expense created successfully',
        };
    }
}
