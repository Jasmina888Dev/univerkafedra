import { useEffect, useState } from 'react';
import { gradeService, subjectService, studentService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

export default function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    value: '', studentId: '', subjectId: '', comment: ''
  });

  useEffect(() => {
    load();
    loadSubjects();
    loadStudents();
  }, []);

  const load = async () => {
    try {
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await gradeService.create(formData);
      toast.success('Оценка добавлена');
      setShowModal(false);
      setFormData({ value: '', studentId: '', subjectId: '', comment: '' });
      load();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление оценками</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить оценку</span>
        </button>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Студент</th>
              <th className="text-left py-3 px-4">Предмет</th>
              <th className="text-left py-3 px-4">Оценка</th>
              <th className="text-left py-3 px-4">Дата</th>
              <th className="text-left py-3 px-4">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {grade.student?.user?.firstName} {grade.student?.user?.lastName}
                </td>
                <td className="py-3 px-4">{grade.subject?.name}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                    {grade.value}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(grade.date).toLocaleDateString('ru-RU')}
                </td>
                <td className="py-3 px-4 text-sm">{grade.comment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Добавить оценку</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Студент</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Выберите студента</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.user.firstName} {s.user.lastName} - {s.group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Предмет</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Выберите предмет</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Оценка</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Комментарий</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="input"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
