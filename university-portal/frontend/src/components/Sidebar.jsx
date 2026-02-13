import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Newspaper, 
  Award,
  TrendingUp,
  ClipboardList,
  BookMarked,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Панель управления', path: '/admin/dashboard' },
          { icon: Users, label: 'Преподаватели', path: '/admin/teachers' },
          { icon: GraduationCap, label: 'Студенты', path: '/admin/students' },
          { icon: BookOpen, label: 'Предметы', path: '/admin/subjects' },
          { icon: FileText, label: 'Учебные планы', path: '/admin/study-plans' },
          { icon: Newspaper, label: 'Новости', path: '/admin/news' },
          { icon: Award, label: 'Выпускники', path: '/admin/graduates' },
          { icon: TrendingUp, label: 'Топ-10 студентов', path: '/admin/top-students' },
        ];
      case 'TEACHER':
        return [
          { icon: LayoutDashboard, label: 'Панель управления', path: '/teacher/dashboard' },
          { icon: BookOpen, label: 'Мои предметы', path: '/teacher/subjects' },
          { icon: ClipboardList, label: 'Оценки', path: '/teacher/grades' },
          { icon: TrendingUp, label: 'Топ-10 студентов', path: '/teacher/top-students' },
        ];
      case 'STUDENT':
        return [
          { icon: LayoutDashboard, label: 'Панель управления', path: '/student/dashboard' },
          { icon: BookMarked, label: 'Мои предметы', path: '/student/subjects' },
          { icon: FileText, label: 'Мой дневник', path: '/student/diary' },
          { icon: TrendingUp, label: 'Топ-10 студентов', path: '/student/top-students' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gradient-to-b from-primary-800 to-primary-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-primary-700">
        <h2 className="text-2xl font-bold">IT Portal</h2>
        <p className="text-primary-200 text-sm mt-1">{user?.role === 'ADMIN' ? 'Администратор' : user?.role === 'TEACHER' ? 'Преподаватель' : 'Студент'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-primary-900 shadow-lg' 
                  : 'text-primary-100 hover:bg-primary-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-700">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || 'https://ui-avatars.com/api/?name=User&size=40'}
            alt={user?.firstName}
            className="w-10 h-10 rounded-full border-2 border-primary-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-primary-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
}
