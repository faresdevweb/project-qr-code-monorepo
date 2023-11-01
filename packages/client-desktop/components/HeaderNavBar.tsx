import Button from './Button';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import Image from 'next/image';
import logo from '../public/logoqrcode.png';

const HeaderNavBar = () => {
  const { LogOut } = useAuth();
  const [cookies] = useCookies(['token']);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );

  return (
    <div className="border-b border-black shadow-sm flex justify-between items-center p-5">
      <div className="flex gap-4">
        <div>
          <Image
            src={logo}
            width={80}
            height={80}
            alt="QR Code image"
          />
        </div>
      </div>
      <div>
        <Button
          variant="secondary"
          label="Se déconnecter"
          onClick={() => {
            LogOut();
          }}
        />
      </div>
    </div>
  );
};

export default HeaderNavBar;
