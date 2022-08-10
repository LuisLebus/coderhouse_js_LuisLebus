

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



function makeSlotsMsg(currentDaySlots) 
{
    let msg = "Seleccione tu turno:" + "\r\n";

    currentDaySlots.forEach(el => {
        msg = msg + el.date.getHours() + "  -  ";
        
        if (true == el.available)
        {
            msg = msg + "Disponible" + "\r\n";
        }
        else
        {
            msg = msg + "Ocupado" + "\r\n";
        }
    });

    return msg;
}



function makeConfirmationMsg(currentUser, currentSlot)
{
    let msg = "Confirme su información: " + "\r\n\r\n" +
                "Usuario: " + currentUser.name  + "\r\n" +
                "Fecha: " + currentSlot.date.toLocaleDateString();
    
    if (true == currentUser.addFee)
    {
        msg = msg + "\r\n\r\n" + "TIENES UN RECARGO POR INCUMPLIMIENTO"
    }

    return msg;
}




// We get and validate the name user 
let validUser = false;
let errorUserCount = 3;
let currentUser;

while ((false == validUser) && (errorUserCount > 0))
{
    let currentUserName = prompt("Ingrese su nombre:");

    validUser = users.some((el) => el.name == currentUserName);
    
    if (true == validUser)
    {
        alert("Bienvenido " + currentUserName + "!")
        
        currentUser = users.find((el) => el.name == currentUserName);
        if (true == currentUser.addFee)
        {
            alert("ATENCION: Tienes un recargo por incumplimiento!");
        }
    }
    else
    {
        alert(currentUserName + " no está registrado.");
        errorUserCount--;
    }
}


// We get and validate the day  
let validDay = false;
let errorDayCount = 3;
let currentDay;

if (true == validUser)
{
    while ((false == validDay) && (errorDayCount > 0))
    {
        currentDay = parseInt( prompt("Ingrese el día del mes:"));

        if ((false == isNaN(currentDay)) && (currentDay > 0) && (currentDay <= daysPerMonth))
        {
            validDay = true;
        }
        else
        {
            alert("Ingrese un día válido");
            errorDayCount--;
        }
    }
}


// We get and validate the hour
let validSlot = false;
let errorSlotCount = 3;
let currentSlot;

if (true == validDay)
{
    let currentDaySlots = slots.filter((el) => el.date.getDate() == currentDay);

    while ((false == validSlot) && (errorSlotCount > 0))
    {
        let currentSlotHour = parseInt( prompt( makeSlotsMsg(currentDaySlots) ) );

        if (false == isNaN(currentSlotHour))
        {
            if (true == currentDaySlots.some((el) => el.date.getHours() == currentSlotHour))
            {
                currentSlot = currentDaySlots.find((el) => el.date.getHours() == currentSlotHour);

                if (true == currentSlot.available)
                {
                    validSlot = true;
                }
                else
                {
                    alert("Ingrese un horario disponible");
                    errorSlotCount--;
                }
            }
            else
            {
                alert("Ingrese un horario válido");
                errorSlotCount--;
            }
        }
        else
        {
            alert("Ingrese un horario válido");
            errorSlotCount--;
        }
    }
}


// We show the information
if (true == validSlot)
{
    alert( makeConfirmationMsg(currentUser, currentSlot));
}
