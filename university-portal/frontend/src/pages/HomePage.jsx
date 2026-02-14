import { Link } from "react-router-dom";
import logoUni from "../image/logoUni.png";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { newsService } from "../services/services";

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
      console.error("Error loading news:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src={logoUni} alt="КНУ логотиби" width={50} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">
                  Ж. Абдырахманов атындагы КНУ
                </span>
                <span className="text-sm text-gray-600">
                  Информациялык Технологиялар Кафедрасы
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Кирүү
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md"
              >
                Катталуу
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
              Жусуп Абдырахманов атындагы Кыргыз Улуттук Университети
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">
              Информациялык Технологиялар
            </span>{" "}
            Кафедрасы
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Кыргызстандагы эң байыркы жана абройлуу жогорку окуу жайлардын
            биринин базасында IT тармагындагы заманбап билим берүү. Алдыңкы
            технологиялар жана окутуу методикалары менен келечектин адистерин
            даярдайбыз.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <span>Окууну баштоо</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* University Info Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Жусуп Абдырахманов атындагы Кыргыз Улуттук Университети
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Calendar
                  className="text-primary-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-lg">Тарыхый маалымат</h4>
                  <p className="text-gray-600">
                    1925-жылы негизделген Кыргызстандагы алгачкы жогорку окуу
                    жай. 1993-жылы көрүнүктүү мамлекеттик жана илимдин ишмери
                    Жусуп Абдырахмановдун 100 жылдык мааракесине карата атындагы
                    университет статусу берилген.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <GraduationCap
                  className="text-primary-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-lg">Бүгүнкү күндө</h4>
                  <p className="text-gray-600">
                    20 000ден ашык студент, 800дөн ашык профессор-окутуучулар
                    курамы. 20дан ашык факультет жана институттар, 50дөн ашык
                    кафедралар.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin
                  className="text-primary-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-lg">Дареги</h4>
                  <p className="text-gray-600">
                    Кыргыз Республикасы, 720001, Бишкек ш., Фрунзе көч., 547
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone
                  className="text-primary-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-lg">Байланыш</h4>
                  <p className="text-gray-600">
                    Телефон: +996 (312) 32-33-34
                    <br />
                    Email: info@knu.kg
                    <br />
                    Сайт: www.knu.kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl shadow-lg">
              <img
                src="https://kutbilim.kg/wp-content/uploads/2025/06/uluttuk-universitet-1-korpus.jpg"
                alt="Жусуп Абдырахманов атындагы КНУ"
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <p className="text-sm text-gray-500 text-center">
                Жусуп Абдырахманов атындагы Кыргыз Улуттук Университетинин башкы
                имараты
              </p>
            </div>
          </div>

          {/* IT Department Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Студенттер</div>
            </div>
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                30+
              </div>
              <div className="text-gray-600">Окутуучулар</div>
            </div>
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                10+
              </div>
              <div className="text-gray-600">Лабораториялар</div>
            </div>
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Бүтүрүүчүлөр</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Эмне үчүн бизди тандашат
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Тажрыйбалуу окутуучулар
              </h3>
              <p className="text-gray-600">
                Биздин окутуучулар - IT тармагында көп жылдык тажрыйбасы бар
                практик адистер, алардын көбү илимдин кандидаттары жана
                докторлору
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Актуалдуу программа</h3>
              <p className="text-gray-600">
                Окуу программасы IT тармагындагы акыркы тенденцияларды эске алуу
                менен үзгүлтүксүз жаңыртылат, эл аралык стандарттарга
                ылайыкташкан
              </p>
            </div>

            <div className="card text-center hover:shadow-xl transition-shadow bg-white">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Карьералык өсүү</h3>
              <p className="text-gray-600">
                Бүтүрүүчүлөрүбүзгө алдыңкы IT компанияларда иш табууга жардам
                беребиз, иштеп жаткан студенттер үчүн стажировка программалары
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Акыркы жаңылыктар
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="card hover:shadow-xl transition-shadow bg-white"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{item.content}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(item.publishDate).toLocaleDateString("ky-KG")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">
                Ж. Абдырахманов атындагы КНУ
              </h4>
              <p className="text-gray-400 text-sm">
                Информациялык Технологиялар Кафедрасы
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Байланыш</h4>
              <p className="text-gray-400 text-sm">
                Фрунзе көч., 547
                <br />
                Бишкек, Кыргызстан
                <br />
                Email: it@knu.kg
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Соц тармактар</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-800">
            <p>
              &copy; 2024 Жусуп Абдырахманов атындагы Кыргыз Улуттук
              Университети. Бардык укуктар корголгон.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
