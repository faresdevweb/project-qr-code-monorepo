import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import { useAuth } from '@/hooks/useAuth';
import { UserData } from '@/interfaces/User.interface';

const Formulaire = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>();

  const { signIn } = useAuth();

  const onSubmit = async (data: UserData) => {
    if (!data.email.trim() || !data.password.trim()) {
      return;
    }
    signIn(data);
    reset();
  };

  return (
    <form
      className="w-[450px] mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Input
          variant="text"
          label="Email"
          placeholder="Enter your email"
          {...register('email', { required: true })}
        />
      </div>
      <div className="mt-4">
        <Input
          variant="password"
          label="Password"
          placeholder="Enter your password"
          {...register('password', { required: true })}
        />
      </div>
      <div className="mt-5">
        <Button
          variant="primary"
          type="submit"
          label="Se connecter"
        />
      </div>
    </form>
  );
};

export default Formulaire;
