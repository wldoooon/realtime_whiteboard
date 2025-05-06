const ThemeToggle = {
  init() {
    const toggleButton = document.createElement("button");
    toggleButton.className = "theme-toggle";
    toggleButton.title = "Toggle Dark Mode";
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    toggleButton.setAttribute("aria-label", "Toggle Dark Mode");

    document.body.appendChild(toggleButton);

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
      document.documentElement.classList.add("dark-theme");
      toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggleButton.addEventListener("click", () => {
      const isDarkTheme =
        document.documentElement.classList.toggle("dark-theme");
      localStorage.setItem("theme", isDarkTheme ? "dark" : "light");

      toggleButton.innerHTML = isDarkTheme
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  },
};

export default ThemeToggle;
