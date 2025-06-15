const menuToggle = document.getElementById("menu-toggle");
      const dropdownMenu = document.getElementById("dropdown-menu");
      const overlay = document.createElement("div"); // Crear overlay dinámicamente
      overlay.className = "overlay";
      document.body.appendChild(overlay);

      // Alternar menú y overlay
      menuToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
        overlay.classList.toggle("active");
      });

      // Cerrar menú al hacer clic en el overlay
      overlay.addEventListener("click", () => {
        dropdownMenu.classList.remove("active");
        overlay.classList.remove("active");
      });