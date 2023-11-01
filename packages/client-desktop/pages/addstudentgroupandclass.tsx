import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { useForm } from 'react-hook-form';
import { useSchool } from '@/hooks/useSchool';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { ClassType } from '@/interfaces/ClassType.interface';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';

const AddStudentGroupAndClass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { isAuthenticated } = useAuth();
  const { classData, addStudentToGroupAndClass } = useSchool();
  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );

  const onSubmit = (data: any) => {
    console.log(data);
    const formData = new FormData();
    formData.append('csv', data.csv[0]);
    addStudentToGroupAndClass(cookies.token, data.class, formData);
    reset();
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <div>
        <h1 className="text-xl text-center mb-5">
          Manage group and class
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[450px] mx-auto"
        >
          <div className="mb-4">
            <Input
              variant="file"
              label="Import Students"
              placeholder="Students csv"
              {...register('csv')}
              className="w-[300px]"
            />
          </div>
          <div>
            <Select
              label="Classe"
              {...register('class')}
              options={
                classData
                  ? classData.map((classItem: ClassType) => ({
                      label: classItem.name,
                      value: classItem.id,
                    }))
                  : []
              }
            />
          </div>
          <div className="text-center mt-5">
            <Button variant="primary" label="Submit" type="submit" />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddStudentGroupAndClass;
