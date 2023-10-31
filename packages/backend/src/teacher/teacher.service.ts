import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as qrcode from 'qrcode';

@Injectable()
export class TeacherService {
    constructor(
        private readonly prismaService: PrismaService
    ){}
}
