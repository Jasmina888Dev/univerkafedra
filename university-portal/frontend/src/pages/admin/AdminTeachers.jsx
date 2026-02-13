import { useEffect, useState } from 'react';
import { teacherService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    phone: '', position: '', department: 'Информационные технологии', degree: '', bio: ''
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teacherService.update(editingTeacher.id, formData);
        toast.success('Обновлено');
      } else {
        await teacherService.create(formData);
        toast.success('Создано');
      }
      handleCloseModal();
      loadTeachers();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить?')) return;
    try {
      await teacherService.delete(id);
      toast.success('Удалено');
      loadTeachers();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      email: teacher.user.email,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      phone: teacher.phone || '',
      position: teacher.position,
      department: teacher.department,
      degree: teacher.degree || '',
      bio: teacher.bio || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormData({
      email: '', password: '', firstName: '', lastName: '',
      phone: '', position: '', department: 'Информационные технологии', degree: '', bio: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Преподаватели</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <img src={teacher.user.avatar} className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{teacher.user.firstName} {teacher.user.lastName}</h3>
                <p className="text-sm text-gray-600">{teacher.position}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {teacher.user.email}</p>
              <p><strong>Степень:</strong> {teacher.degree || 'Н/Д'}</p>
              <p><strong>Предметов:</strong> {teacher.subjects?.length || 0}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:text-blue-800">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingTeacher ? 'Редактировать' : 'Добавить'} преподавателя</h2>
              <button onClick={handleCloseModal}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Имя</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Фамилия</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" required />
                </div>
                {!editingTeacher && (
                  <div>
                    <label className="label">Пароль</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input" required />
                  </div>
                )}
                <div>
                  <label className="label">Телефон</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Должность</label>
                  <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Степень</label>
                  <input type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="input" />
                </div>
                <div className="col-span-2">
                  <label className="label">Биография</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="input" rows="3"></textarea>
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
