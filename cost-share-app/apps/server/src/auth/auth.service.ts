import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthService {
    constructor(private readonly supabase: SupabaseService) {}

    async verifyAccessToken(token: string): Promise<AuthUser> {
        const { data, error } = await this.supabase.client.auth.getUser(token);
        if (error || !data.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        return {
            id: data.user.id,
            email: data.user.email ?? undefined,
        };
    }
}
