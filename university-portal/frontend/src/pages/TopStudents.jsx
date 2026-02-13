import { useEffect, useState } from 'react';
import { studentService } from '../services/services';
import { Trophy } from 'lucide-react';

export default function TopStudents() {
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await studentService.getTop();
      setTopStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Trophy className="text-yellow-500" size={36} />
          <span>Топ-10 студентов</span>
        </h1>
        <p className="text-gray-600 mt-1">Лучшие студенты по среднему баллу</p>
      </div>

      <div className="grid gap-4">
        {topStudents.map((student, index) => (
          <div key={student.id} className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                index === 0 ? 'bg-yellow-400 text-white' :
                index === 1 ? 'bg-gray-300 text-white' :
                index === 2 ? 'bg-orange-400 text-white' :
                'bg-primary-100 text-primary-700'
              }`}>
                {index + 1}
              </div>
              <img src={student.avatar} className="w-16 h-16 rounded-full" alt={student.firstName} />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
                <p className="text-gray-600">{student.group} • Курс {student.course}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{student.averageGrade}</p>
                <p className="text-sm text-gray-500">Средний балл</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
