const saved = localStorage.getItem("lightmode");

if (saved === "true") {
  document.body.classList.add("light-mode");
}
