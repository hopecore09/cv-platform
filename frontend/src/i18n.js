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
          app: {
            title: 'CV Platform',
            positions: 'Positions',
            profile: 'Profile',
            attributes: 'Attributes',
            login: 'Sign In',
            register: 'Sign Up',
            logout: 'Sign Out',
            search: 'Search...',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            new: 'New',
            loading: 'Loading...',
            noData: 'No data found',
            users: 'Users',
            theme: 'Theme',
            light: 'Light',
            dark: 'Dark',
            dashboard: 'Dashboard'
          },
          auth: {
            password: 'Password',
            register: 'Register',
            alreadyHaveAccount: 'Already have an account?',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email'
          },
          pos: {
            title: 'Positions',
            company: 'Company',
            level: 'Level',
            cvs: 'CVs',
            status: 'Status',
            public: 'Public',
            private: 'Private'
          },
          position: {
            title: 'Title',
            company: 'Company',
            level: 'Level',
            selectLevel: 'Select...',
            status: 'Status',
            public: 'Public',
            private: 'Private',
            description: 'Description',
            attributes: 'Attributes',
            selectAttributes: 'Select attributes...',
            saving: 'Saving...',
            edit: 'Edit',
            back: 'Back',
            noLevel: 'No level',
            createCV: 'Create CV for this position',
            saveCV: 'Save CV',
            publish: 'Publish',
            published: 'Published',
            draft: 'Draft',
            noCVs: 'No CVs submitted yet',
            noCV: 'No CV available'
          },
          profile: {
            title: 'My Profile',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            me: 'Me',
            info: 'Info',
            cvs: 'CVs',
            noCvs: 'No CVs yet'
          },
          attr: {
            title: 'Attributes',
            name: 'Name',
            category: 'Category',
            type: 'Type',
            options: 'Options',
            required: 'Required',
            description: 'Description'
          },
          cv: {
            title: 'CV',
            publish: 'Publish',
            published: 'Published',
            draft: 'Draft',
            back: 'Back',
            notFound: 'CV not found'
          },
          admin: {
            manageUsers: 'Manage Users',
            id: 'ID',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            actions: 'Actions',
            makeRecruiter: 'Make Recruiter',
            makeCandidate: 'Make Candidate',
            delete: 'Delete',
            selectUsers: 'Select users to perform actions',
            users: 'Users'
          }
        }
      },
      ru: {
        translation: {
          app: {
            title: 'CV Платформа',
            positions: 'Позиции',
            profile: 'Профиль',
            attributes: 'Атрибуты',
            login: 'Войти',
            register: 'Регистрация',
            logout: 'Выйти',
            search: 'Поиск...',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            new: 'Новый',
            loading: 'Загрузка...',
            noData: 'Нет данных',
            users: 'Пользователи',
            theme: 'Тема',
            light: 'Светлая',
            dark: 'Тёмная',
            dashboard: 'Главная'
          },
          auth: {
            password: 'Пароль',
            register: 'Зарегистрироваться',
            alreadyHaveAccount: 'Уже есть аккаунт?',
            firstName: 'Имя',
            lastName: 'Фамилия',
            email: 'Email'
          },
          pos: {
            title: 'Позиции',
            company: 'Компания',
            level: 'Уровень',
            cvs: 'Резюме',
            status: 'Статус',
            public: 'Публичная',
            private: 'Приватная'
          },
          position: {
            title: 'Название',
            company: 'Компания',
            level: 'Уровень',
            selectLevel: 'Выберите...',
            status: 'Статус',
            public: 'Публичная',
            private: 'Приватная',
            description: 'Описание',
            attributes: 'Атрибуты',
            selectAttributes: 'Выберите атрибуты...',
            saving: 'Сохранение...',
            edit: 'Редактировать',
            back: 'Назад',
            noLevel: 'Нет уровня',
            createCV: 'Создать резюме для этой позиции',
            saveCV: 'Сохранить резюме',
            publish: 'Опубликовать',
            published: 'Опубликовано',
            draft: 'Черновик',
            noCVs: 'Нет отправленных резюме',
            noCV: 'Нет доступных резюме'
          },
          profile: {
            title: 'Мой профиль',
            firstName: 'Имя',
            lastName: 'Фамилия',
            email: 'Email',
            me: 'Обо мне',
            info: 'Информация',
            cvs: 'Резюме',
            noCvs: 'Нет резюме'
          },
          attr: {
            title: 'Атрибуты',
            name: 'Название',
            category: 'Категория',
            type: 'Тип',
            options: 'Опции',
            required: 'Обязательный',
            description: 'Описание'
          },
          cv: {
            title: 'Резюме',
            publish: 'Опубликовать',
            published: 'Опубликовано',
            draft: 'Черновик',
            back: 'Назад',
            notFound: 'Резюме не найдено'
          },
          admin: {
            manageUsers: 'Управление пользователями',
            id: 'ID',
            email: 'Email',
            name: 'Имя',
            role: 'Роль',
            actions: 'Действия',
            makeRecruiter: 'Сделать рекрутером',
            makeCandidate: 'Сделать кандидатом',
            delete: 'Удалить',
            selectUsers: 'Выберите пользователей для действий',
            users: 'Пользователи'
          }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })