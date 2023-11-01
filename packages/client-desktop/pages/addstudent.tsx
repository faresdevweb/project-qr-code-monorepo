import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useRegister } from '@/hooks/useRegister';
import Input from '@/components/Input';
import Button from '@/components/Button';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';

const AddStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerStudent } = useRegister();

  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );
  const { isAuthenticated } = useAuth();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('csv', data.csv[0]);
    formData.append('schoolId', decodedToken.schoolCustomId);
    registerStudent(formData, cookies.token);
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <div className="p-5 h-screen">
        <h1 className="mb-2">Register student</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-black flex flex-col gap-4 w-[500px] p-3"
        >
          <Input
            variant="file"
            label="Import Students"
            placeholder="First name"
            {...register('csv')}
            className="w-[300px]"
          />
          <Button variant="primary" label="Submit" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default AddStudent;
