import { useEffect, useState } from 'react';
import { studyPlanService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function AdminStudyPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await studyPlanService.getAll();
      setPlans(data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Учебные планы</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </div>

      <div className="grid gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="card">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600">{plan.description}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                Год: {plan.year}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                Предметов: {plan.subjects?.length || 0}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                Студентов: {plan.students?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
