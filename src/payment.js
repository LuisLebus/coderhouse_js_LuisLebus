import { currentUser } from "./data/CurrentUser.js";

if (currentUser.isValid() == true) {
  document.getElementById("lblLogin").innerText = "Salir";
  document.getElementById("lblLogin").addEventListener("click", (e) => {
    e.preventDefault();
    currentUser.setEmail("");
    window.location.href = "../index.html";
  });
}

document.getElementById("btnDebit").addEventListener("click", () => {
  Swal.fire({
    icon: "error",
    text: "No es posible procesar su pago",
  });
});

document.getElementById("btnCash").addEventListener("click", () => {
  Swal.fire({
    icon: "error",
    text: "No es posible procesar su pago",
  });
});
