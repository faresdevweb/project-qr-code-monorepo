import Link from 'next/link';

const AdminSidebar = () => {
  return (
    <div className="border-r border-black h-screen">
      <h1 className="mb-5 p-3">sidebar admin</h1>
      <div className="p-3 flex flex-col gap-4">
        <Link href={'/main'}>
          <p className="hover:underline">Main page</p>
        </Link>
        <Link href={'/addstudent'}>
          <p className="hover:underline">Register student</p>
        </Link>
        <Link href={'/addteacher'}>
          <p className="hover:underline">Register teacher</p>
        </Link>
        <Link href={'/createfiliere'}>
          <p className="hover:underline">Create filiere</p>
        </Link>
        <Link href={'/createyear'}>
          <p className="hover:underline">Create year</p>
        </Link>
        <Link href={'/createclass'}>
          <p className="hover:underline">Create class</p>
        </Link>
        <Link href={'/creategroup'}>
          <p className="hover:underline">Create group</p>
        </Link>
        <Link href={'/managecourse'}>
          <p className="hover:underline">Manage course</p>
        </Link>
        <Link href={'/addstudentgroupandclass'}>
          <p className="hover:underline">
            Add student to group and class
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
