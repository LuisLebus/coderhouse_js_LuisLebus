import { userList } from "./data/UserList.js";
import { slotList } from "./data/SlotList.js";
import { currentUser } from "./data/CurrentUser.js";

let selectedSlot = null;
let engineWashService = false;
let waxService = false;
let total = 0;

const divMain = document.getElementById("divMain");

//Dependiendo si hay un usuario logueado se carga una u otra pantalla
if (currentUser.isValid() == false) {
  divMain.innerHTML = `
    <h1>Bienvenido a ASTRA</h1>
    <a class="btn btn-success" href="./pages/login.html" role="button">Ingresar</a>
    <h3 class="fs-4 mt-5 animate__animated animate__pulse animate__infinite infinite">
        ¡Registrate ahora y obtené $400 de regalo!</h3>`;
} else {
  divMain.innerHTML = `
    <div class="d-flex flex-column m-1 gap-3 justify-content-center align-items-center">
        <h1>${await userList.getName(currentUser.getEmail())}</h1>
        <h2>$${await userList.getBalance(currentUser.getEmail())}</h2>
        <a
          class="btn btn-outline-dark"
          href="./pages/payment.html"
          role="button"
          >Ingresar dinero</a
        >
    </div>
    <div class="mt-5">
        <a class="btn btn-success" id="btnSelectDay" role="button">Reservar turno</a>
    </div>`;

  document.getElementById("lblLogin").innerText = "Salir";
  document.getElementById("lblLogin").addEventListener("click", (e) => {
    e.preventDefault();
    currentUser.setEmail("");
    window.location.href = "./index.html";
  });

  document.getElementById("btnSelectDay").addEventListener("click", selectDay);
}

//Pantalla para seleccionar el dia
function selectDay() {
  divMain.innerHTML = `
    <div>
        <h2>Seleccione una fecha</h2>
    </div>

    <input type="date" id="selectedDay" value="2022-09-24" min="2022-09-24" max="2022-09-24">

    <div class="mt-5">
        <a class="btn btn-outline-dark" href="./index.html" role="button">Volver</a>
        <a class="btn btn-success" id="btnSelectSlot" role="button">Siguiente</a>
    </div>`;

  document
    .getElementById("btnSelectSlot")
    .addEventListener("click", selectSlot);
}

//Pantalla para seleccionar el horario
async function selectSlot() {
  divMain.innerHTML = `
    <div>
        <h2>Seleccione un horario</h2>
      </div>

      <ul class="list-group w-25">
        <li class="list-group-item">
          <input
            class="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value=""
            id="radio16"
          />
          <label class="form-check-label ms-2" for="radio16">16:00 Hs</label>
        </li>
        <li class="list-group-item">
          <input
            class="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value=""
            id="radio17"
          />
          <label class="form-check-label ms-2" for="radio17">17:00 Hs</label>
        </li>
        <li class="list-group-item">
          <input
            class="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value=""
            id="radio18"
          />
          <label class="form-check-label ms-2" for="radio18">18:00 Hs</label>
        </li>
        <li class="list-group-item">
          <input
            class="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value=""
            id="radio19"
          />
          <label class="form-check-label ms-2" for="radio19">19:00 Hs</label>
        </li>
        <li class="list-group-item">
          <input
            class="form-check-input me-1"
            type="radio"
            name="listGroupRadio"
            value=""
            id="radio20"
          />
          <label class="form-check-label ms-2" for="radio20">20:00 Hs</label>
        </li>
      </ul>

      <div class="mt-5">
        <a class="btn btn-outline-dark" href="./index.html" role="button">Volver</a>
        <a class="btn btn-success" id="btnSelectService" role="button">Siguiente</a>
    </div>`;

  const radioGroup = document.getElementsByName("listGroupRadio");

  //Se deshabilitan los radio button que corresponden a horaios ocupados
  radioGroup.forEach(async (element, i) => {
    element.disabled = (await slotList.isAvailable(
      slotList.getFirstSlotHour() + i
    ))
      ? false
      : true;
  });

  document
    .getElementById("btnSelectService")
    .addEventListener("click", selectService);
}

//Pantalla para seleccionar el servicio
function selectService() {
  const radioGroup = document.getElementsByName("listGroupRadio");

  radioGroup.forEach((element, i) => {
    if (element.checked) {
      selectedSlot = i + slotList.getFirstSlotHour();
      return;
    }
  });

  if (selectedSlot == null) {
    Swal.fire({
      icon: "error",
      text: "Seleccione un horario",
    });
  } else {
    divMain.innerHTML = `
        <div>
            <h2>Seleccione los servicios</h2>
        </div>

        <ul class="list-group w-25">
            <li class="list-group-item">
            <input
                class="form-check-input me-1"
                type="checkbox"
                name="listGroupRadio"
                value=""
                id="cbStandarWash"
                checked
                disabled
            />
            <label class="form-check-label ms-2" for="cbStandarWash">Lavado estandar</label>
            </li>
            <li class="list-group-item">
            <input
                class="form-check-input me-1"
                type="checkbox"
                name="listGroupRadio"
                value=""
                id="cbEngineWash"
            />
            <label class="form-check-label ms-2" for="cbEngineWash">Lavado de motor</label>
            </li>
            <li class="list-group-item">
            <input
                class="form-check-input me-1"
                type="checkbox"
                name="listGroupRadio"
                value=""
                id="cbWax"
            />
            <label class="form-check-label ms-2" for="cbWax">Encerado</label>
            </li>
        </ul>

        <div class="mt-5">
            <a class="btn btn-outline-dark" href="./index.html" role="button">Volver</a>
            <a class="btn btn-success" id="btnConfirm" role="button">Siguiente</a>
        </div>`;

    document.getElementById("btnConfirm").addEventListener("click", confirm);
  }
}

//Pantalla para confirmar reserva
function confirm() {
  engineWashService = document.getElementById("cbEngineWash").checked;
  waxService = document.getElementById("cbWax").checked;

  total = 50;

  if (engineWashService) {
    total += 80;
  }

  if (waxService) {
    total += 35;
  }

  divMain.innerHTML = `
    <div>
        <h2>Confirmar reserva</h2>
    </div>

    <p>24 de Septiembre ${selectedSlot}:00 Hs</p>
    <h4>$${total}</h4>

    <div class="mt-5">
        <a class="btn btn-outline-dark" href="./index.html" role="button">Volver</a>
        <a class="btn btn-success" id="btnPay" role="button">Reservar</a>
    </div>`;

  document.getElementById("btnPay").addEventListener("click", pay);
}

//Funcion para hacer el pago y actulizar el server de horarios y de usuarios
async function pay() {
  let currBalance = await userList.getBalance(currentUser.getEmail());

  if (currBalance < total) {
    Swal.fire({
      icon: "error",
      text: "Saldo insuficiente",
    });
  } else {
    let newBalance = currBalance - total;

    let succesUserUpdate = await userList.setBalance(
      currentUser.getEmail(),
      newBalance
    );

    let succesSlotUpdate = await slotList.update(selectedSlot);

    if (succesUserUpdate && succesSlotUpdate) {
      Swal.fire({
        icon: "success",
        text: "Turno reservado",
      }).then(async (result) => {
        var templateParams = {
          email: currentUser.getEmail(),
          name: await userList.getName(currentUser.getEmail()),
          date: `24 de Septiembre ${selectedSlot}:00 Hs`,
        };

        emailjs.send("service_zl128z1", "template_22bqt0i", templateParams);

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
  }
}
