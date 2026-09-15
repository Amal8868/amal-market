import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to SuperMarket",
      "search_placeholder": "Search for products...",
      "cart": "Cart",
      "login": "Login",
      "admin_dashboard": "Admin Dashboard",
      "categories": "Categories",
      "orders": "Orders",
      "users": "Users",
      "settings": "Settings"
    }
  },
  ar: {
    translation: {
      "welcome": "أهلاً بك في سوبر ماركت",
      "search_placeholder": "ابحث عن المنتجات...",
      "cart": "عربة التسوق",
      "login": "تسجيل الدخول",
      "admin_dashboard": "لوحة التحكم",
      "categories": "الفئات",
      "orders": "الطلبات",
      "users": "المستخدمين",
      "settings": "الإعدادات"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
