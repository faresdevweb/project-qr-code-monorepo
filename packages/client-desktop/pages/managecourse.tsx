import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import Input from '@/components/Input';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import Select from '@/components/Select';
import jwt from 'jsonwebtoken';
import { GroupeType } from '@/interfaces/GroupeType.interface';
import { TeacherType } from '@/interfaces/TeacherType.interface';
import { CourseType } from '@/interfaces/CourseType.interface';
import { useCourse } from '@/hooks/useCourse';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';

const ManageCourse = () => {
  const {
    register: registerCreateCourse,
    handleSubmit: handleSubmitCreateCourse,
    control,
    formState: { errors: errorCreateCourse },
    reset: resetCreateCourse,
  } = useForm();
  const {
    register: registerAddStudentToCourse,
    handleSubmit: handleSubmitAddStudentToCourse,
    formState: { errors: errorAddStudentToCourse },
    reset: resetAddStudentToCourse,
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );
  const {
    groupe,
    teacher,
    course,
    createCourse,
    addStudentToCourse,
  } = useCourse(cookies.token);

  const onSubmitCreateCourse = (data: any) => {
    if (
      data.date &&
      data.subject &&
      data.subject.trim() !== '' &&
      data.duration &&
      data.duration.trim() !== '' &&
      data.groupe &&
      data.groupe.trim() !== '' &&
      data.teacher &&
      data.teacher.trim() !== ''
    ) {
      createCourse(
        cookies.token,
        data.subject,
        data.date,
        Number(data.duration),
        data.teacher,
        data.groupe,
      );
      resetCreateCourse();
    }
  };

  const onsubmitAddStudentToCourse = (data: any) => {
    if (
      data.groupe &&
      data.groupe.trim() !== '' &&
      data.course &&
      data.course.trim() !== ''
    ) {
      addStudentToCourse(cookies.token, data.course, data.groupe);
      resetAddStudentToCourse();
    }
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <div>
        <h1 className="text-center text-xl mb-3">Manage course</h1>
      </div>
      <div className="flex">
        <form
          onSubmit={handleSubmitCreateCourse(onSubmitCreateCourse)}
          className="border border-black rounded-lg flex flex-col gap-4 w-[450px] mx-auto p-5"
        >
          <h1 className="text-center">Create course</h1>
          <Controller
            name="date"
            control={control}
            rules={{ required: 'La date est requise!' }}
            render={({ field }) => (
              <DatePicker
                label="Date"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input
            variant="text"
            label="Matière"
            placeholder="Matière"
            {...registerCreateCourse('subject')}
          />
          <Input
            variant="number"
            label="Durée"
            placeholder="Durée"
            {...registerCreateCourse('duration')}
          />
          <Select
            label="Groupe"
            options={
              (groupe as GroupeType[]).map((groupe) => {
                return {
                  label: groupe.name,
                  value: groupe.id,
                };
              }) ?? []
            }
            {...registerCreateCourse('groupe')}
          />
          <Select
            label="Teacher"
            options={
              (teacher as TeacherType[]).map((teacher) => {
                return {
                  label: teacher.firstName + ' ' + teacher.lastName,
                  value: teacher.id,
                };
              }) ?? []
            }
            {...registerCreateCourse('teacher')}
          />
          <Button variant="primary" label="Submit" type="submit" />
        </form>
        <form
          onSubmit={handleSubmitAddStudentToCourse(
            onsubmitAddStudentToCourse,
          )}
          className="border border-black rounded-lg flex flex-col gap-4 w-[450px] mx-auto p-5"
        >
          <h1 className="text-center">Add students to course</h1>
          <Select
            label="Groupe"
            options={
              (groupe as GroupeType[]).map((groupe) => {
                return {
                  label: groupe.name,
                  value: groupe.id,
                };
              }) ?? []
            }
            {...registerAddStudentToCourse('groupe')}
          />
          <Select
            label="Course"
            options={
              (course as CourseType[]).map((course) => {
                return {
                  label: course.name,
                  value: course.id,
                };
              }) ?? []
            }
            {...registerAddStudentToCourse('course')}
          />
          <Button variant="primary" label="Submit" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default ManageCourse;
