import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as jwt from 'jsonwebtoken';
import { Course } from "@prisma/client";

@Injectable()
export class StudentService {
    constructor(
        private prisma: PrismaService
    ){}
}
