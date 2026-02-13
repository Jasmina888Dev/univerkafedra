import { useEffect, useState } from 'react';
import { graduateService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function AdminGraduates() {
  const [graduates, setGraduates] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await graduateService.getAll();
      setGraduates(data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Выпускники</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {graduates.map((grad) => (
          <div key={grad.id} className="card text-center">
            <img src={grad.photo || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-full mx-auto mb-4" alt={grad.firstName} />
            <h3 className="font-bold text-lg">{grad.firstName} {grad.lastName}</h3>
            <p className="text-sm text-gray-600 mb-2">Выпуск {grad.graduateYear}</p>
            {grad.currentJob && (
              <p className="text-sm"><strong>{grad.currentJob}</strong></p>
            )}
            {grad.company && (
              <p className="text-sm text-gray-600">{grad.company}</p>
            )}
            {grad.achievement && (
              <p className="text-sm text-gray-500 mt-2">{grad.achievement}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
