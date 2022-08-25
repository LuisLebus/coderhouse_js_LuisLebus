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
    constructor(name, addFee)
    {
        this.name = name;
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

function addUser(name, addFee)
{
    users.push(new User(name, addFee));

    console.log(users);
    
    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUserName()
{
    localStorage.setItem('currentUserName', currentUserName);
    loginOk = true;
}


//==========================
//  End user.js
//==========================


//==========================
//  index.js
//==========================

let mainContent = document.getElementById("mainContent");
let auxContent = document.getElementById("auxContent");

let labelUserName = document.getElementById("labelUserName");

let btnReset = document.getElementById("btnReset");
let btnExit = document.getElementById("btnExit");

btnExit.disabled = true;


loadUsers();
loadSlots();

function checkLogin()
{
    if(loginOk == true)
    {
        btnExit.disabled = false;
        labelUserName.innerText = currentUserName;

        mainContent.innerHTML = `<p>Ingrese el día: <input id="userDay" type="text"></p>
                                <button id="btnDay">Consultar</button>`;

        document.getElementById("btnDay").addEventListener("click", checkDay);

        auxContent.innerHTML = "";
    }
    else
    {
        mainContent.innerHTML = `<div>
                                    <h2>USUARIO</h2>
                                    <input id="userName" type="text">
                                </div>
                                <div>
                                    <button id="btnLogin">INGRESAR</button>
                                </div>`;

        document.getElementById("btnLogin").addEventListener("click", checkUser);

        labelUserName.innerText = "Usuario";
        btnExit.disabled = true;
    }
}

checkLogin();

btnExit.addEventListener("click", exitLogin);

function exitLogin()
{
    loginOk = false;
    
    checkLogin();
}


let currentUser;

function checkUser()
{
    currentUserName = document.getElementById("userName").value;

    let validUser = users.some((el) => el.name == currentUserName);
    
    if (true == validUser)
    {
        currentUser = users.find((el) => el.name == currentUserName);

        setCurrentUserName();
        
        btnExit.disabled = false;
        labelUserName.innerText = currentUserName;

        mainContent.innerHTML = `<p>Ingrese el día: <input id="userDay" type="text"></p>
                                 <button id="btnDay">Consultar</button>`;

        document.getElementById("btnDay").addEventListener("click", checkDay);

        auxContent.innerHTML = "";
    }
    else
    {
        auxContent.innerHTML = `<h2>${currentUserName} no está registrado.</h2>
                                <button id="btnAdd">REGISTRAR</button>`
        
        document.getElementById("btnAdd").addEventListener("click", registerUser);
    }
}


function registerUser()
{
    addUser(currentUserName, false);

    setCurrentUserName();

    currentUser = users.find((el) => el.name == currentUserName);

    btnExit.disabled = false;
    labelUserName.innerText = currentUserName;

    mainContent.innerHTML = `<p>Ingrese el día: <input id="userDay" type="text"></p>
                             <button id="btnDay">Consultar</button>`;

    document.getElementById("btnDay").addEventListener("click", checkDay);

    auxContent.innerHTML = "";
}


let currentUserDay;

function checkDay()
{
    currentUserDay = document.getElementById("userDay").value;

    if ((false == isNaN(currentUserDay)) && (currentUserDay > 0) && (currentUserDay <= daysPerMonth))
    {
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
        mainContent.innerHTML += `<button id="btnSend">Enviar</button>`;

        document.getElementById("btnSend").addEventListener("click", checkSlot);
        
        auxContent.innerHTML = "";
    }
    else
    {
        auxContent.innerHTML = "<h2>Ingrese un día válido</h2>";
    }
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
                let msg = "Resumen: " + "<br><br>" +
                "Usuario: " + currentUser.name  + "<br>" +
                "Fecha: " + currentSlot.date.toLocaleDateString();

                if (true == currentUser.addFee)
                {
                    msg = msg + "<br><br>" + "TIENES UN RECARGO POR INCUMPLIMIENTO"
                }

                mainContent.innerHTML = `<p>${msg}</p>`;

                auxContent.innerHTML = "";  
            }
            else
            {
                auxContent.innerHTML = "<h2>Ingrese un horario disponible</h2>";  
            }
        }
        else
        {
            auxContent.innerHTML = "<h2>Ingrese un horario válido</h2>";
        }
    }
    else
    {
        auxContent.innerHTML = "<h2>Ingrese un horario válido</h2>";
    }
}

//==========================
//  End index.js
//==========================