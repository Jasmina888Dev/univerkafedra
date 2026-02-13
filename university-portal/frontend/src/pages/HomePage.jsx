import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Award, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { newsService } from '../services/services';

export default function HomePage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsService.getAll();
      setNews(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="text-primary-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">Университет</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Войти
              </Link>
              <Link to="/register" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Кафедра <span className="text-primary-600">Информационных Технологий</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Современное образование в сфере IT. Готовим специалистов будущего с применением передовых технологий и методик обучения.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <span>Начать обучение</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Опытные преподаватели</h3>
              <p className="text-gray-600">Наши преподаватели - практикующие специалисты с многолетним опытом в IT-индустрии</p>
            </div>
            
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Актуальная программа</h3>
              <p className="text-gray-600">Учебная программа регулярно обновляется с учетом последних тенденций в IT</p>
            </div>
            
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Карьерный рост</h3>
              <p className="text-gray-600">Помогаем нашим выпускникам найти работу в ведущих IT-компаниях</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Последние новости</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div key={item.id} className="card hover:shadow-xl transition-shadow">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{item.content}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(item.publishDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Кафедра Информационных Технологий. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
