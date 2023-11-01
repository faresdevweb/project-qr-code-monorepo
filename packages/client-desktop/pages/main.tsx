import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';

const Main = () => {
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);

  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken ? decodedToken.role : undefined}>
      <div className="h-screen">
        <h1 className="text-center">main</h1>
      </div>
    </Layout>
  );
};

export default Main;
