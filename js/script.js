

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

class User
{
    constructor(name, addFee)
    {
        this.name = name;
        this.addFee = addFee;
    }
}


//Fill slots with randon information
const slots = [];

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


//Fill users with randon information
const users = [];

users.push(new User("Juan", false));
users.push(new User("Luis", false));
users.push(new User("Carlos", true));
users.push(new User("Miguel", true));
users.push(new User("Mateo", false));



document.getElementById("btnLogin").addEventListener("click", checkUser);

function checkUser()
{
    let currentUserName = document.getElementById("userName").value;

    validUser = users.some((el) => el.name == currentUserName);
    
    let userMsg = document.getElementById("userMsg");

    if (true == validUser)
    {
        userMsg.innerHTML = `<h2>Bienvenido ${currentUserName}!</h2>`
        
        currentUser = users.find((el) => el.name == currentUserName);
        if (true == currentUser.addFee)
        {
            userMsg.innerHTML += "<h3>ATENCION: Tienes un recargo por incumplimiento!</h3>"
        }

        let day = document.getElementById("day");

        day.innerHTML = `<p>Ingrese el día: <input id="userDay" type="text"></p>
                            <button id="btnDay">Consultar</button>`;

        document.getElementById("btnDay").addEventListener("click", checkDay);
    }
    else
    {
        userMsg.innerHTML = `<h2>${currentUserName} no está registrado.</h2>`
    }
}




let currentUserDay;

function checkDay()
{
    currentUserDay = document.getElementById("userDay").value;

    let slotsMsg = document.getElementById("slotsMsg");

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

        

        slotsMsg.innerHTML = `<p>${msg}</p>`;

        slotsMsg.innerHTML += `<input id="userSlot" type="text"></input>`
        slotsMsg.innerHTML += `<button id="btnSend">Enviar</button>`;

        document.getElementById("btnSend").addEventListener("click", checkSlot);
    }
    else
    {
        slotsMsg.innerHTML = "<h2>Ingrese un día válido</h2>";
    }
}



function checkSlot()
{
    let currentUserSlot = document.getElementById("userSlot").value;

    let confirmMsg = document.getElementById("confirmMsg");

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

                confirmMsg.innerHTML = `<p>${msg}</p>`;
            }
            else
            {
                confirmMsg.innerHTML = "<h2>Ingrese un horario disponible</h2>";                
            }
        }
        else
        {
            confirmMsg.innerHTML = "<h2>Ingrese un horario válido</h2>";
        }
    }
    else
    {
        confirmMsg.innerHTML = "<h2>Ingrese un horario válido</h2>";
    }
}