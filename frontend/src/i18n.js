import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

export default i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          app: { title: 'CV Platform', positions: 'Positions', profile: 'Profile', attributes: 'Attributes', login: 'Login', register: 'Register', logout: 'Logout', search: 'Search...', save: 'Save', cancel: 'Cancel', delete: 'Delete', new: 'New', loading: 'Loading...', noData: 'No data' },
          pos: { title: 'Positions', company: 'Company', level: 'Level', cvs: 'CVs', status: 'Status', public: 'Public', private: 'Private' },
          profile: { title: 'My Profile', firstName: 'First Name', lastName: 'Last Name', email: 'Email' },
          attr: { title: 'Attributes', name: 'Name', category: 'Category', type: 'Type', options: 'Options', required: 'Required', description: 'Description' },
          cv: { title: 'CV', publish: 'Publish', published: 'Published', draft: 'Draft' }
        }
      },
      ru: {
        translation: {
          app: { title: 'CV Платформа', positions: 'Позиции', profile: 'Профиль', attributes: 'Атрибуты', login: 'Войти', register: 'Регистрация', logout: 'Выйти', search: 'Поиск...', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', new: 'Новый', loading: 'Загрузка...', noData: 'Нет данных' },
          pos: { title: 'Позиции', company: 'Компания', level: 'Уровень', cvs: 'Резюме', status: 'Статус', public: 'Публичная', private: 'Приватная' },
          profile: { title: 'Мой профиль', firstName: 'Имя', lastName: 'Фамилия', email: 'Email' },
          attr: { title: 'Атрибуты', name: 'Название', category: 'Категория', type: 'Тип', options: 'Опции', required: 'Обязательный', description: 'Описание' },
          cv: { title: 'Резюме', publish: 'Опубликовать', published: 'Опубликовано', draft: 'Черновик' }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })