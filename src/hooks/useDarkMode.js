import { useEffect, useState } from "react";
function useDarkMode() {
  const [theme, settheme] = useState(localStorage.getItem("theme") || "light");
  const toggle = () => {
    settheme((p) => (p === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  return { theme, toggle };
}
export default useDarkMode;
