import { useLanguage } from "../contexts/LanguageContext";

export const useTranslation = () => {
  const { t, formatNumber, formatDate, language } = useLanguage();

  return { t, formatNumber, formatDate, language };
};
