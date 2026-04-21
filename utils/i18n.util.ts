import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import vi from '../locales/vi.json';
import en from '../locales/en.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

// 1. Tự tạo một Detector dành riêng cho React Native
const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function () {
    try {
      // Ưu tiên 1: Lấy ngôn ngữ user đã tự chọn và lưu trong máy
      const savedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (savedLanguage) {
        return savedLanguage;
      }

      // Ưu tiên 2: Nếu user chưa từng chọn, lấy theo ngôn ngữ của hệ điều hành
      const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'vi';
      return deviceLang;
    } catch (error) {
      console.log('Error reading language', error);
      return 'vi'; // Mặc định fallback về tiếng Việt nếu có lỗi
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      // Mỗi khi user đổi ngôn ngữ, tự động lưu lại vào bộ nhớ
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

// 2. Khởi tạo i18next với Detector vừa tạo
i18n
  .use(languageDetector) // Nhúng detector vào đây
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3' as any,
    nonExplicitSupportedLngs: true,
    react: { useSuspense: false },

    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React đã tự chống XSS rồi nên không cần
    },
    // Lưu ý: Đã bỏ đi trường 'lng' vì languageDetector sẽ tự động lo việc cấp ngôn ngữ
  });

export default i18n;
