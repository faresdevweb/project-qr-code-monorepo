import HeaderNavBar from './HeaderNavBar';
import AdminSidebar from './AdminSidebar';
import TeacherSidebar from './TeacherSidebar';

type LayoutProps = {
  children: React.ReactNode;
  userRole?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => (
  <div>
    <header>
      <HeaderNavBar />
    </header>
    <div className="flex h-screen">
      <div className="w-1/5">
        {userRole === 'ADMIN' ? (
          <AdminSidebar />
        ) : userRole === 'TEACHER' ? (
          <TeacherSidebar />
        ) : null}{' '}
      </div>
      <main className="w-4/5 ">{children}</main>
    </div>
  </div>
);

export default Layout;
