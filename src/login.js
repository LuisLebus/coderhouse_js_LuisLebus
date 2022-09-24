import { currentUser } from "./data/CurrentUser.js";
import { userList } from "./data/UserList.js";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  let inputEmail = document.getElementById("inputEmail").value;
  let inputPassword = document.getElementById("inputPassword").value;

  if (inputPassword.trim() != "" && inputEmail.trim() != "") {
    let ret = await userList.checkCredential(inputEmail, inputPassword);

    if (ret == true) {
      currentUser.setEmail(inputEmail);

      setTimeout(() => {
        window.location.href = "../index.html";
      }, "1000");
    } else {
      Swal.fire({
        icon: "error",
        text: "Usuario o contraseña incorrecta",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      text: "No se permiten espacios en blanco",
    });
  }
});
