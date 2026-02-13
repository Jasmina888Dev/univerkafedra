import { useEffect, useState } from 'react';
import { studentService, studyPlanService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    studentCode: '', course: '1', group: '', phone: '',
    gender: 'MALE', enrollYear: new Date().getFullYear(), studyPlanId: ''
  });

  useEffect(() => {
    loadStudents();
    loadStudyPlans();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      toast.error('Ошибка загрузки студентов');
    }
  };

  const loadStudyPlans = async () => {
    try {
      const data = await studyPlanService.getAll();
      setStudyPlans(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, formData);
        toast.success('Студент обновлен');
      } else {
        await studentService.create(formData);
        toast.success('Студент создан');
      }
      handleCloseModal();
      loadStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить студента?')) return;
    try {
      await studentService.delete(id);
      toast.success('Студент удален');
      loadStudents();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      email: student.user.email,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      studentCode: student.studentCode,
      course: student.course.toString(),
      group: student.group,
      phone: student.phone || '',
      gender: student.gender,
      enrollYear: student.enrollYear,
      studyPlanId: student.studyPlanId || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      email: '', password: '', firstName: '', lastName: '',
      studentCode: '', course: '1', group: '', phone: '',
      gender: 'MALE', enrollYear: new Date().getFullYear(), studyPlanId: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Студенты</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить студента</span>
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Студент</th>
                <th className="text-left py-3 px-4">Код</th>
                <th className="text-left py-3 px-4">Курс</th>
                <th className="text-left py-3 px-4">Группа</th>
                <th className="text-left py-3 px-4">Средний балл</th>
                <th className="text-right py-3 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={student.user.avatar} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold">{student.user.firstName} {student.user.lastName}</p>
                        <p className="text-sm text-gray-500">{student.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{student.studentCode}</td>
                  <td className="py-3 px-4">{student.course}</td>
                  <td className="py-3 px-4">{student.group}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                      {student.averageGrade || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingStudent ? 'Редактировать' : 'Добавить'} студента</h2>
                <button onClick={handleCloseModal}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Имя</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Фамилия</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  {!editingStudent && (
                    <div>
                      <label className="label">Пароль</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="label">Код студента</label>
                    <input
                      type="text"
                      value={formData.studentCode}
                      onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Курс</label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="input"
                    >
                      {[1, 2, 3, 4].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Группа</label>
                    <input
                      type="text"
                      value={formData.group}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Телефон</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Пол</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="input"
                    >
                      <option value="MALE">Мужской</option>
                      <option value="FEMALE">Женский</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Год поступления</label>
                    <input
                      type="number"
                      value={formData.enrollYear}
                      onChange={(e) => setFormData({ ...formData, enrollYear: parseInt(e.target.value) })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Учебный план</label>
                    <select
                      value={formData.studyPlanId}
                      onChange={(e) => setFormData({ ...formData, studyPlanId: e.target.value })}
                      className="input"
                    >
                      <option value="">Выберите план</option>
                      {studyPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Отмена</button>
                  <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
