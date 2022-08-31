//==========================
//      slot.js
//==========================

//Constants
const defaultYear = 2022;
const defaultMonth = 4;
const defaultHour = 9;
const defaultMinute = 0;
const defaultSecond = 0;

const slotsPerDay = 8;
const daysPerMonth = 30;

class Slot
{
    constructor(date, available)
    {
        this.date = date;
        this.available = available;
    }    
}

const slots = [];

function loadSlots() 
{
    for (let i = 1; i <= daysPerMonth; i++)
    {
        for (let j = 0; j < slotsPerDay; j++)
        {
            let slotDate = new Date(defaultYear, defaultMonth, i, defaultHour + j, defaultMinute, defaultSecond);
            let slotAvailable = true;

            if(0 == Math.round( Math.random() ))
            {
                slotAvailable = false;
            }

            slots.push(new Slot(slotDate, slotAvailable));
        }
    }
}

//==========================
//  End slot.js
//==========================


//==========================
//      user.js
//==========================

class User
{
    constructor(name, pass, addFee)
    {
        this.name = name;
        this.pass = pass;
        this.addFee = addFee;
    }
}

let users = [];
let currentUserName = "";
let loginOk = false;


function loadUsers() 
{
    let usersAux = JSON.parse(localStorage.getItem('users'));

    if(usersAux != null)
    {
        users = usersAux;
    }

    currentUserName = localStorage.getItem('currentUserName');
    
    if ((currentUserName != null) && (currentUserName != ""))
    {
        loginOk = true;
    }
}

function addUser(name, pass, addFee)
{
    users.push(new User(name, pass, addFee));

    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUserName()
{
    localStorage.setItem('currentUserName', currentUserName);
}


//==========================
//  End user.js
//==========================


//==========================
//  index.js
//==========================

let mainContent = document.getElementById("mainContent");

let labelUserName = document.getElementById("labelUserName");

let btnReset = document.getElementById("btnReset");
let btnExit = document.getElementById("btnExit");

btnExit.disabled = true;

let currentUser;

loadUsers();
loadSlots();

checkLogin();

function checkLogin()
{
    if(loginOk == true)
    {
        currentUser = users.find((el) => el.name == currentUserName);

        btnExit.disabled = false;
        labelUserName.innerText = currentUserName;

        mainContent.innerHTML = `<p>Ingrese el día: 
                                    <input type="date" id="userDay"
                                    value="2022-09-01"
                                    min="2022-09-01" 
                                    max="2022-09-30">
                                </p>
                                <button id="btnDay" class="btn btn-primary">Consultar</button>`;

        document.getElementById("btnDay").addEventListener("click", checkDay);
    }
    else
    {
        mainContent.innerHTML = `<div class="form-group mt-1 mb-1">
                                    <label class="mb-1" for="userName">Usuario</label>
                                    <input type="text" class="form-control" id="userName">
                                </div>
                                <div class="form-group mt-1 mb-1">
                                    <label class="mb-1" for="userPass">Contraseña</label>
                                    <input type="password" class="form-control" id="userPass">
                                </div>
                                <div class="mx-auto text-center mt-1 mb-1">
                                    <button id="btnLogin" name="button" class="btn btn-primary btn-lg fs-6 ps-4 pe-4">Ingresar</button>
                                </div>
                                <div class="mx-auto text-center mt-4 mb-4">
                                    <button id="btnAdd" class="btn btn-outline-dark">Registrar</button>
                                </div>`;

        document.getElementById("btnLogin").addEventListener("click", checkUser);
        document.getElementById("btnAdd").addEventListener("click", registerUser);

        labelUserName.innerText = "";
        btnExit.disabled = true;
    }
}


btnExit.addEventListener("click", exitLogin);

function exitLogin()
{
    loginOk = false;

    Toastify({
        text: "Sesion cerrada",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
    
    checkLogin();
}


function checkUser()
{
    currentUserName = document.getElementById("userName").value;
    currentUserPass = document.getElementById("userPass").value;

    let validUser = users.some((el) => ((el.name == currentUserName) && (el.pass == currentUserPass)));
    
    if (true == validUser)
    {
        currentUser = users.find((el) => el.name == currentUserName);

        setCurrentUserName();
        
        btnExit.disabled = false;
        labelUserName.innerText = currentUserName;

        mainContent.innerHTML = `<p>Ingrese el día: 
                                    <input type="date" id="userDay"
                                    value="2022-09-01"
                                    min="2022-09-01" 
                                    max="2022-09-30">
                                </p>
                                <button id="btnDay" class="btn btn-primary">Consultar</button>`;

        document.getElementById("btnDay").addEventListener("click", checkDay);
        
        Toastify({
            text: "Bienvenido!",
            duration: 3000,
            gravity: "top",
            position: "center", 
            stopOnFocus: true,
        }).showToast();
    }
    else
    {
        Swal.fire({
            icon: 'error',
            text: 'Usuario o contraseña incorrecta',
          })
    }
}


function registerUser()
{
    let newUserName = document.getElementById("userName").value;
    let newUserPass = document.getElementById("userPass").value;

    let alreadyUser = users.some((el) => (el.name == newUserName));

    if(alreadyUser == true)
    {
        Swal.fire({
            icon: 'error',
            title: newUserName,
            text: 'El usuario ya está registrado',
          });
    }
    else
    {
        addUser(newUserName, newUserPass, true);

        Swal.fire({
            icon: 'success',
            title: currentUserName,
            text: 'Usuario registrado',
          })
    }
}


let currentUserDay;

function checkDay()
{
    currentUserDay = document.getElementById("userDay").value.split("-")[2];

    let currentDaySlots = slots.filter((el) => el.date.getDate() == currentUserDay);

    let msg = "Seleccione tu turno:" + "<br>";

    currentDaySlots.forEach(el => {
        msg = msg + el.date.getHours() + "  -  ";
        
        if (true == el.available)
        {
            msg = msg + "Disponible" + "<br>";
        }
        else
        {
            msg = msg + "Ocupado" + "<br>";
        }
    });


    mainContent.innerHTML = `<p>${msg}</p>`;

    mainContent.innerHTML += `<input id="userSlot" type="text"></input>`
    mainContent.innerHTML += `<button id="btnSend" class="btn btn-primary">Enviar</button>`;

    document.getElementById("btnSend").addEventListener("click", checkSlot);
}


function checkSlot()
{
    let currentUserSlot = document.getElementById("userSlot").value;

    let currentDaySlots = slots.filter((el) => el.date.getDate() == currentUserDay);

    if (false == isNaN(currentUserSlot))
    {
        if (true == currentDaySlots.some((el) => el.date.getHours() == currentUserSlot))
        {
            currentSlot = currentDaySlots.find((el) => el.date.getHours() == currentUserSlot);

            if (true == currentSlot.available)
            {
                let msg = "Usuario: " + currentUser.name  + "<br>" +
                          "Fecha: " + currentSlot.date.toLocaleDateString();

                if (true == currentUser.addFee)
                {
                    msg = msg + "<br><br>" + "TIENES UN RECARGO POR INCUMPLIMIENTO"
                }

                Swal.fire({
                    icon: 'success',
                    title: msg,
                    text: 'Horario reservado',
                  });
            }
            else
            {
                Swal.fire({
                    icon: 'error',
                    text: 'Horario inválido',
                  });
            }
        }
        else
        {
            Swal.fire({
                icon: 'error',
                text: 'Horario inválido',
              });
        }
    }
    else
    {
        Swal.fire({
            icon: 'error',
            text: 'Horario inválido',
          });
    }
}

//==========================
//  End index.js
//==========================