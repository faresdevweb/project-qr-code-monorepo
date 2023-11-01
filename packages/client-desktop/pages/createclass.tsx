import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useSchool } from '@/hooks/useSchool';
import { useCookies } from 'react-cookie';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import jwt from 'jsonwebtoken';
import { YearType } from '@/interfaces/YearType.interface';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';

const CreateClass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );
  const { createClass, year } = useSchool();

  const onSubmit = (data: any) => {
    createClass(cookies.token, data.classe, data.annee);
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;
  return (
    <Layout userRole={decodedToken.role}>
      <div>
        <h1 className="text-xl text-center mb-5">Add Class</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[450px] mx-auto"
        >
          <div className="mb-4">
            <Input
              variant="text"
              label="Classe"
              placeholder="Classe"
              {...register('classe')}
            />
          </div>
          <div>
            <Select
              label="Année"
              {...register('annee')}
              options={
                (year as YearType[]).map((year) => {
                  return {
                    label: year.year,
                    value: year.id,
                  };
                }) ?? []
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

export default CreateClass;
