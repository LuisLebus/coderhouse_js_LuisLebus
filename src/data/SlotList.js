import { Slot } from "./Slot.js";

const slotListUrl = "https://json.extendsclass.com/bin/bb952b993ccb";

const firstSlotHour = 16;

export default class SlotList {
  constructor() {
    this.slots = [];
    this.loaded = false;
  }

  //Actualiza el server con el nuevo horario ocupado
  async update(hour) {
    let returnValue = false;

    await this.loadFromServer();

    let i = hour - firstSlotHour;

    this.slots[i].available = false;

    if ((await this.sendToServer()) == true) {
      returnValue = true;
    } else {
      this.slots[i].available = true;
    }

    return returnValue;
  }

  //Lee desde el server los horarios de un dia
  async loadFromServer() {
    if (this.loaded == false) {
      const resp = await fetch(slotListUrl);
      const data = await resp.json();

      if (resp.ok == true) {
        while (this.slots.length > 0) {
          this.slots.pop();
        }

        data.forEach((element) => {
          const newSlot = new Slot(element.hour, element.available);

          this.slots.push(newSlot);
        });

        this.loaded = true;
      } else {
        console.log("Error al leer server");
      }
    }
  }

  //Envia la info al server
  async sendToServer() {
    let returnValue = false;

    const resp = await fetch(slotListUrl, {
      method: "PUT",
      body: JSON.stringify(this.slots),
      headers: {
        "Api-key": "5fc7b6e0-3a06-11ed-b537-0242ac110002",
      },
    });

    if (resp.ok == true) {
      returnValue = true;
    } else {
      console.log("Error al enviar server");
    }

    return returnValue;
  }

  //Retorna si el horario esta libre
  async isAvailable(hour) {
    await this.loadFromServer();

    const slot = this.slots.find((slot) => {
      return slot.hour == hour;
    });

    return slot.available;
  }

  //Retorna el horario de inicio del dia. 16 Hs en este caso.
  getFirstSlotHour() {
    return firstSlotHour;
  }
}

export const slotList = new SlotList();
