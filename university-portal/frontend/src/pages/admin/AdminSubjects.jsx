import { useEffect, useState } from 'react';
import { subjectService, teacherService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', credits: '4', hours: '64', semester: '1', description: '', teacherId: ''
  });

  useEffect(() => {
    loadSubjects();
    loadTeachers();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectService.update(editingSubject.id, formData);
        toast.success('Обновлено');
      } else {
        await subjectService.create(formData);
        toast.success('Создано');
      }
      handleCloseModal();
      loadSubjects();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить?')) return;
    try {
      await subjectService.delete(id);
      toast.success('Удалено');
      loadSubjects();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits.toString(),
      hours: subject.hours.toString(),
      semester: subject.semester.toString(),
      description: subject.description || '',
      teacherId: subject.teacherId || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setFormData({
      name: '', code: '', credits: '4', hours: '64', semester: '1', description: '', teacherId: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Предметы</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => (
          <div key={subject.id} className="card hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl">{subject.name}</h3>
                <p className="text-sm text-gray-600">{subject.code}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(subject)} className="text-blue-600">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(subject.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Кредиты:</strong> {subject.credits} | <strong>Часы:</strong> {subject.hours}</p>
              <p><strong>Семестр:</strong> {subject.semester}</p>
              {subject.teacher && (
                <p><strong>Преподаватель:</strong> {subject.teacher.user.firstName} {subject.teacher.user.lastName}</p>
              )}
              {subject.description && <p className="text-gray-600">{subject.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingSubject ? 'Редактировать' : 'Добавить'} предмет</h2>
              <button onClick={handleCloseModal}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Название</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Код</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Кредиты</label>
                  <input type="number" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Часы</label>
                  <input type="number" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Семестр</label>
                  <input type="number" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Преподаватель</label>
                  <select value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="input">
                    <option value="">Выберите</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.user.firstName} {t.user.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Описание</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows="3"></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Отмена</button>
                <button type="submit" className="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
