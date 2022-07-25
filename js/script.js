function makeMsg() 
{
    let msg = "Seleccione tu turno:" + "\r\n" +
                "    1  -  10 Hs  -  Disponible" + "\r\n" +
                "    2  -  11 Hs  -  Disponile" + "\r\n" +
                "    3  -  12 Hs  -  Ocupado" + "\r\n" +
                "    4  -  13 Hs  -  Disponible" + "\r\n" +
                "    5  -  14 Hs  -  Ocupado";

    return msg;
}

function showSlotUnavailable(slot)
{
    alert("El turno " + slot + " está ocupado.");
}

function showSlotError()
{
    alert("El turno no es válido.");
}

function showClientError()
{
    alert("El nombre no es válido.");
}

function showSlotConfirmation(client, slot)
{
    alert("Confirme la información: " + "\r\n" +
            "    Cliente: " + client + "\r\n" +
            "    Turno: " + slot);
}


let slot = "0";
let slotOk = false;

do 
{
    slot = prompt( makeMsg() );

    switch (slot)
    {
        case "1":
            slotOk = true;
            break
        
        case "2":
            slotOk = true;
            break

        case "3":
            showSlotUnavailable(slot);
            break

        case "4":
            slotOk = true;
            break

        case "5":
            showSlotUnavailable(slot);
            break

        default:
            showSlotError();
    }

} while (false == slotOk)


let client = "";

do 
{
    client = prompt("Ingrese su nombre.");

    if ("" == client)
    {
        showClientError();
    }

} while ("" == client)


showSlotConfirmation(client, slot);