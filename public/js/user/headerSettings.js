// Toggle Profile Menu
const profileIcon = document.getElementById("profile_icon");
profileIcon.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click from propagating to the document
  const profileMenu = document.getElementById("profile_menu");
  profileMenu.classList.toggle("settings_menu_height");
  closeSettingsMenu(); // Close settings menu when profile menu is toggled
});

// Toggle Settings Menu
const settingsIcon = document.getElementById("settings_icon");
settingsIcon.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click from propagating to the document
  const settingsMenu = document.getElementById("setting_menu");
  settingsMenu.classList.toggle("settings_menu_height");
  closeProfileMenu(); // Close profile menu when settings menu is toggled
});

// Close Menus When Clicking Outside
document.addEventListener("click", () => {
  closeProfileMenu();
  closeSettingsMenu();
});

// Helper Functions
function closeProfileMenu() {
  const profileMenu = document.getElementById("profile_menu");
  if (profileMenu.classList.contains("settings_menu_height")) {
    profileMenu.classList.remove("settings_menu_height");
  }
}

function closeSettingsMenu() {
  const settingsMenu = document.getElementById("setting_menu");
  if (settingsMenu.classList.contains("settings_menu_height")) {
    settingsMenu.classList.remove("settings_menu_height");
  }
}

// const dark_btn = document.getElementById("dark_btn");
// function settingsMenuToggle() {}
