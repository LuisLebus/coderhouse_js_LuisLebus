import { userList } from "./data/UserList.js";

document.getElementById("formSignup").addEventListener("submit", async (e) => {
  e.preventDefault();

  let inputName = document.getElementById("inputName").value;
  let inputEmail = document.getElementById("inputEmail").value;
  let inputPassword = document.getElementById("inputPassword").value;

  if (
    inputPassword.trim() != "" &&
    inputEmail.trim() != "" &&
    inputName.trim() != ""
  ) {
    let ret = await userList.add(inputName, inputEmail, inputPassword, 400);

    if (ret == true) {
      Swal.fire({
        icon: "success",
        text: "Bienvenido a ASTRA",
      }).then((result) => {
        var templateParams = {
          email: inputEmail,
          name: inputName,
          password: inputPassword,
        };

        emailjs.send("service_zl128z1", "template_6418lyb", templateParams);

        setTimeout(() => {
          window.location.href = "../index.html";
        }, "1000");
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Algo salió mal",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      text: "No se permiten espacios en blanco",
    });
  }
});
