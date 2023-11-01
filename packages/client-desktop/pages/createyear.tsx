import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useSchool } from '@/hooks/useSchool';
import { FiliereType } from '@/interfaces/FiliereType.interface';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';

const CreateYear = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const { createYear, filiere } = useSchool();
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(cookies.token);

    createYear(cookies.token, data.year, data.filiere);
    reset();
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;
  return (
    <Layout userRole={decodedToken.role}>
      <div>
        <h1 className="text-xl text-center mb-5">Add Year</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[450px] mx-auto"
        >
          <div className="mb-4">
            <Input
              variant="text"
              label="Année"
              placeholder="Année"
              {...register('year')}
            />
          </div>
          <div>
            <Select
              label="Filiere"
              {...register('filiere')}
              options={
                (filiere as FiliereType[]).map((filiere) => {
                  return {
                    label: filiere.name,
                    value: filiere.id,
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

export default CreateYear;
