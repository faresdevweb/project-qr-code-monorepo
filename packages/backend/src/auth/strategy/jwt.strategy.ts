import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { FieldRef } from '@prisma/client/runtime/library';
import { UserRole } from '@prisma/client';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET')
        });
    }

    
    async validate(
            payload: { 
                sub: string; 
                email: string; 
                role: UserRole | FieldRef<"User", "UserRole"> 
            }
        ) {

        const user = await this.prisma.user.findUnique({
            where: { 
                id: payload.sub, 
                email: payload.email, 
                role: { equals: payload.role } 
            },
        });

        if (!user) {
            throw new UnauthorizedException(
                "You don't have permission to access this resource",
            );
        }

        if (user.role !== payload.role) {
            throw new UnauthorizedException("Invalid user role");
        }
        

        delete user.hashPassword;
        return user;
    }
    
}