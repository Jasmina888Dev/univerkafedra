import { useEffect, useState } from 'react';
import { gradeService } from '../../services/services';
import { useAuthStore } from '../../store/authStore';

export default function StudentDiary() {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      if (user?.student) {
        const data = await gradeService.getByStudent(user.student.id);
        setGrades(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)
    : 0;

  // Group grades by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    const subjectId = grade.subject.id;
    if (!acc[subjectId]) {
      acc[subjectId] = {
        subject: grade.subject,
        grades: []
      };
    }
    acc[subjectId].grades.push(grade);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Мой дневник</h1>
        <p className="text-gray-600 mt-1">История оценок и успеваемость</p>
      </div>

      <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-lg">Средний балл</p>
            <p className="text-5xl font-bold mt-2">{averageGrade}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100">Всего оценок</p>
            <p className="text-3xl font-bold mt-2">{grades.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.values(gradesBySubject).map(({ subject, grades: subjectGrades }) => {
          const avg = (subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length).toFixed(1);
          return (
            <div key={subject.id} className="card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Средний балл</p>
                  <p className="text-2xl font-bold text-primary-600">{avg}</p>
                </div>
              </div>
              <div className="grid gap-3">
                {subjectGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(grade.date).toLocaleDateString('ru-RU')}
                      </p>
                      {grade.comment && (
                        <p className="text-sm text-gray-700 mt-1">{grade.comment}</p>
                      )}
                    </div>
                    <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-bold text-lg">
                      {grade.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
