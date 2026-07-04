import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        return savedTheme;
      }
      
      const savedOldDark = localStorage.getItem("darkTheme");
      if (savedOldDark !== null) {
        return savedOldDark === "true" ? "dark" : "light";
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage:", e);
    }
    return "system";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDOM = () => {
      let shouldBeDark = false;
      if (theme === "dark") {
        shouldBeDark = true;
      } else if (theme === "light") {
        shouldBeDark = false;
      } else {
        shouldBeDark = mediaQuery.matches;
      }
      document.body.classList.toggle("dark-theme", shouldBeDark);
    };

    updateDOM();

    const handleChange = () => {
      if (theme === "system") {
        updateDOM();
      }
    };

    // Attach listener for Dynamic real-time system changes
    if (theme === "system") {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
      setTheme(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        console.warn("Could not write theme to localStorage:", e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
