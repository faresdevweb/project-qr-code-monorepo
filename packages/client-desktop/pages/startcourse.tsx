import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { CourseType } from '@/interfaces/CourseType.interface';
import { useTeacher } from '@/hooks/useTeacher';
import { useForm } from 'react-hook-form';

const StartCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );
  const { course, startCourse } = useTeacher(cookies.token);

  const onSubmit = (data: any) => {
    console.log(data);
    if (data.course) {
      startCourse(data.course);
    }
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken ? decodedToken.role : undefined}>
      <h1 className="text-center">start course page</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-black p-4 w-[450px] mx-auto text-center mt-5 rounded-lg"
      >
        <div>
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
            {...register('course')}
          />
        </div>
        <div className="mt-5">
          <Button type="submit" label="Start course" />
        </div>
      </form>
    </Layout>
  );
};

export default StartCourse;
