/**
 * App Module
 * Root module that imports all controllers and services
 */

import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { GroupsController } from './controllers/groups.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { UsersService } from './services/users.service';
import { GroupsService } from './services/groups.service';
import { ExpensesService } from './services/expenses.service';

@Module({
    imports: [],
    controllers: [UsersController, GroupsController, ExpensesController],
    providers: [UsersService, GroupsService, ExpensesService],
})
export class AppModule { }
