//sidebar funtionality
const sidebarButton = document.getElementById("sidebar-button");
sidebarButton.addEventListener("click", (e) => {
  e.preventDefault();
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display = "flex";
});
const sidebarCloseButton = document.getElementById("sidebar-close");
sidebarCloseButton.addEventListener("click", (e) => {
  e.preventDefault();
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display = "none";
});
