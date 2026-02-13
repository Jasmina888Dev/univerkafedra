import { useEffect, useState } from 'react';
import { subjectService } from '../../services/services';
import { Plus } from 'lucide-react';

export default function TeacherSubjects() {
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Мои предметы</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить предмет</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => (
          <div key={subject.id} className="card hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{subject.code}</p>
            <div className="space-y-2 text-sm">
              <p><strong>Кредиты:</strong> {subject.credits}</p>
              <p><strong>Часы:</strong> {subject.hours}</p>
              <p><strong>Семестр:</strong> {subject.semester}</p>
              <p><strong>Студентов:</strong> {subject.grades?.length || 0}</p>
            </div>
            {subject.description && (
              <p className="mt-4 text-gray-600 text-sm">{subject.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
