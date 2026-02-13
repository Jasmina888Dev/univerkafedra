import { useEffect, useState } from 'react';
import { gradeService, subjectService } from '../../services/services';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      if (user?.student) {
        const [gradesData, subjectsData] = await Promise.all([
          gradeService.getByStudent(user.student.id),
          subjectService.getAll()
        ]);
        setGrades(gradesData);
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Добро пожаловать, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">Панель управления студента</p>
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
              <p className="text-purple-100">Средний балл</p>
              <p className="text-3xl font-bold mt-2">{averageGrade}</p>
            </div>
            <TrendingUp size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Всего оценок</p>
              <p className="text-3xl font-bold mt-2">{grades.length}</p>
            </div>
            <Award size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Последние оценки</h2>
        <div className="space-y-3">
          {grades.slice(0, 5).map((grade) => (
            <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{grade.subject?.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(grade.date).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-bold text-lg">
                {grade.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
