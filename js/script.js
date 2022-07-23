const MAX_NUM = 350;

let count = 0;

while (count < MAX_NUM)
{
    count += parseInt(prompt("Ingrese un valor!"));

    if (count < MAX_NUM)
    {
        alert("La cuenta es: " + count)
    }
    else
    {
        alert("La cuenta superó el límite!")
    }
}