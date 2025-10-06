import React, { createContext, useContext, useState } from "react";
import en from "../locales/en.json";
import es from "../locales/es.json";

const LanguageContext = createContext();

const translations = {
  en,
  es,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key, params) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    // If value not found, return key
    if (!value) return key;

    // If no params, return value as is
    if (!params || typeof value !== "string") return value;

    // Replace {{variable}} with params
    return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return params[varName] !== undefined ? params[varName] : match;
    });
  };

  const formatNumber = (number, decimals = 2) => {
    const num = parseFloat(number);
    if (isNaN(num)) return number;

    if (language === "es") {
      return num
        .toFixed(decimals)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    if (language === "es") {
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
