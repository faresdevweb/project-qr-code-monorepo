import Layout from '@/components/Layout';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/interfaces/DecodedToken.interface';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { CourseType } from '@/interfaces/CourseType.interface';
import { useTeacher } from '@/hooks/useTeacher';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

const GenerateQrCode = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const { course, generateQrCode } = useTeacher(cookies.token);
  const decodedToken: DecodedToken | string | any = jwt.decode(
    cookies.token,
  );
  const [qrCode, setQrCode] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    if (data.course) {
      const qrCodeResult = await generateQrCode(data.course);
      if (qrCodeResult) {
        setQrCode(qrCodeResult);
      } else {
        console.error('Failed to generate QR code data.');
      }
    }
  };

  if (!isAuthenticated)
    return <div className="text-center text-xl">Loading...</div>;

  return (
    <Layout userRole={decodedToken.role}>
      <h1 className="text-center">generate qrcode page</h1>
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
                  label: course.started
                    ? course.name + ' has Started'
                    : course.name + ' has Not started',
                  value: course.id,
                };
              }) ?? []
            }
            {...register('course')}
          />
        </div>
        <div className="mt-5">
          <Button type="submit" label="Generate QR CODE" />
        </div>
      </form>
      <div className="text-center mt-5 w-[300px] mx-auto">
        {qrCode && (
          <Image
            src={qrCode}
            width={300}
            height={300}
            alt="QR Code image"
          />
        )}
      </div>
    </Layout>
  );
};

export default GenerateQrCode;
