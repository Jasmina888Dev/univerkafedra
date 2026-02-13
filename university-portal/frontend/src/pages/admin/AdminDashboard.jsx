import { useEffect, useState } from 'react';
import { statsService, studentService } from '../../services/services';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, topData] = await Promise.all([
        statsService.get(),
        studentService.getTop()
      ]);
      setStats(statsData);
      setTopStudents(topData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  const courseData = {
    labels: stats?.studentsByCourse.map(item => `${item.course} курс`) || [],
    datasets: [{
      data: stats?.studentsByCourse.map(item => item.count) || [],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
    }]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-1">Обзор системы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Студенты</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Преподаватели</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalTeachers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Предметы</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalSubjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Средний балл</p>
              <p className="text-3xl font-bold mt-2">{stats?.averageGrade?.toFixed(1) || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Распределение по курсам</h3>
          <div className="h-64 flex items-center justify-center">
            {stats?.studentsByCourse && <Doughnut data={courseData} />}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Топ-5 студентов</h3>
          <div className="space-y-3">
            {topStudents.slice(0, 5).map((student, index) => (
              <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <img src={student.avatar} alt={student.firstName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-600">{student.group}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{student.averageGrade}</p>
                  <p className="text-xs text-gray-500">Балл</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
