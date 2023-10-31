import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    UseGuards,
    Request, 
    UseInterceptors, 
    UploadedFile,
    Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/decorators';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
    CreateClassDTO, 
    CreateFiliereDTO, 
    CreateYearDTO, 
    createGroupDto, 
    createCourseDto, 
    addStudentsToCourseDTO} from './dto';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ){}

    @Get('getFiliere')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getFiliere(@Request() req: any) {
        return this.adminService.getFiliere(req);
    }

    @Get('getYear')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getYear(@Request() req: any) {
        return this.adminService.getYear(req);
    }

    @Get('getClass')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getClass(
      @Request() req: any
    ) {
        return this.adminService.getClass(req);
    }

    @Get('getGroup')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getGroup(
      @Request() req: any
    ) {
        return this.adminService.getGroup(req);
    }

    @Get('getCourse')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getCourse(
      @Request() req: any
    ) {
        return this.adminService.getCourse(req);
    }

    @Post("createFiliere")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createFiliere(
      @Body() createFiliereDTO: CreateFiliereDTO,
      @Request() req: any
    ) {
        return this.adminService.createFiliere(createFiliereDTO,req.user);
    }

    @Post("createYear")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createYear(
      @Body() createYearDTO: CreateYearDTO,
      @Request() req: any
    ) {
        return this.adminService.createYear(createYearDTO, req.user);
    }

    @Post("createClass")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createClass(
      @Body() createClassDTO: CreateClassDTO,
      @Request() req: any
    ) {
        return this.adminService.createClass(createClassDTO, req.user);
    }

    @Post("createGroup")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createGroup(
      @Body() createGroupDTO: createGroupDto,
      @Request() req: any
    ) {
        return this.adminService.createGroup(createGroupDTO, req.user);
    }

    @Post("createCourse")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createCourse(@Body() createCourseDto: createCourseDto, @Request() req: any) {
      return this.adminService.createCourse(createCourseDto,req);
    }

    @Put(':courseId/add-students-to-course')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    addGroupeToCourse(
      @Param('courseId') courseId: string, 
      @Body() addStudentsDto: addStudentsToCourseDTO
    ) {
      return this.adminService.addGroupeToCourse(courseId, addStudentsDto);
    }

    @Put(':classId/add-students')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('csv'))
    addStudentsToClassAndGroup(
      @Param('classId') classId: string,
      @UploadedFile() file: Express.Multer.File
    ) {
        return this.adminService.addStudentsToClassAndGroup(classId, file);
    }

    @Get(":courseId/sign-in-info")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getSignInStudents(@Param('courseId') courseId: string) {
        return this.adminService.getSignInInfo(courseId);
    }

    @Get(':courseId')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    getIssues(@Param('courseId') courseId: string) {
        return this.adminService.getIssues(courseId);
    }
    
}
