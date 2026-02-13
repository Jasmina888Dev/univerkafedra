import { useEffect, useState } from 'react';
import { subjectService } from '../../services/services';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, Users, ClipboardList } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Добро пожаловать, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">Панель управления преподавателя</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Мои предметы</p>
              <p className="text-3xl font-bold mt-2">{subjects.length}</p>
            </div>
            <BookOpen size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Студенты</p>
              <p className="text-3xl font-bold mt-2">
                {subjects.reduce((sum, s) => sum + (s.grades?.length || 0), 0)}
              </p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Оценки</p>
              <p className="text-3xl font-bold mt-2">
                {subjects.reduce((sum, s) => sum + (s.grades?.length || 0), 0)}
              </p>
            </div>
            <ClipboardList size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Мои предметы</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg">{subject.name}</h3>
              <p className="text-sm text-gray-600">{subject.code}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span>Кредиты: {subject.credits}</span>
                <span>Семестр: {subject.semester}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
