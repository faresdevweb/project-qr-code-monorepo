import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import { useTeacher } from '@/hooks/useTeacher';
import { useForm } from 'react-hook-form';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import { CourseType } from '@/interfaces/CourseType.interface';
import Select from '@/components/Select';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';

const ReportIssues = () => {
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
  const { course, reportIssues } = useTeacher(cookies.token);

  const onSubmit = (data: any) => {
    console.log(data);
    if (data.course && data.description) {
      reportIssues(data.description, data.course);
    }
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <h1 className="text-center mb-5">report issues page</h1>
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
          <TextArea label="Issue" {...register('description')} />
        </div>
        <div className="mt-5">
          <Button type="submit" label="Submit" />
        </div>
      </form>
    </Layout>
  );
};

export default ReportIssues;
