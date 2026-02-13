import { useEffect, useState } from 'react';
import { newsService } from '../../services/services';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await newsService.getAllAdmin();
      setNews(data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить новость?')) return;
    try {
      await newsService.delete(id);
      toast.success('Удалено');
      load();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Новости</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </div>

      <div className="grid gap-6">
        {news.map((item) => (
          <div key={item.id} className="card">
            <div className="flex gap-6">
              {item.image && (
                <img src={item.image} className="w-48 h-32 object-cover rounded-lg" alt={item.title} />
              )}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2">{item.content}</p>
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {item.published ? 'Опубликовано' : 'Черновик'}
                  </span>
                  <span className="text-gray-500">
                    {new Date(item.publishDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
