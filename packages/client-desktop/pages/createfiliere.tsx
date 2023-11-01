import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useSchool } from '@/hooks/useSchool';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import Input from '@/components/Input';
import Button from '@/components/Button';

const CreateFiliere = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { createFiliere } = useSchool();

  const { LogOut, isAuthenticated } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );

  const onSubmit = (data: any) => {
    createFiliere(
      cookies.token,
      data.filiereName,
      decodedToken.schoolId,
    );
    reset();
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <div>
        <h1 className="text-xl text-center mb-5">Add Filiere</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[450px] mx-auto"
        >
          <div className="mb-4">
            <Input
              variant="text"
              label="Nom de la filiere"
              placeholder="Nom de la filiere"
              {...register('filiereName')}
            />
          </div>
          <Button variant="primary" label="Submit" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default CreateFiliere;
