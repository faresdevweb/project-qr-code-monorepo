import Link from 'next/link';

const TeacherSidebar = () => {
  return (
    <div className="border-r border-black h-screen">
      <h1 className="mb-5 p-3">sidebar teacher</h1>
      <div className="p-3 flex flex-col gap-4">
        <Link href={'/startcourse'}>
          <p className="hover:underline">Start course</p>
        </Link>
        <Link href={'/reportissues'}>
          <p className="hover:underline">Report issues</p>
        </Link>
        <Link href={'/generateqrcode'}>
          <p className="hover:underline">Generate QR CODE</p>
        </Link>
      </div>
    </div>
  );
};

export default TeacherSidebar;
