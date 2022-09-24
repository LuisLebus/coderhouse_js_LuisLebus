import { User } from "./User.js";

const userListUrl = "https://json.extendsclass.com/bin/c180939f7850";

export default class UserList {
  constructor() {
    this.users = [];
    this.loaded = false;
  }

  //Agrega un nuevo usuario y lo envia al server
  async add(name, email, password, balance) {
    let returnValue = false;

    await this.loadFromServer();

    if (this.exist(email) == false) {
      const newUser = new User(name, email, password, balance);

      this.users.push(newUser);

      if ((await this.sendToServer()) == true) {
        returnValue = true;
      } else {
        this.users.pop();
      }
    }

    return returnValue;
  }

  //Lee del server la info de todos los usuarios
  async loadFromServer() {
    if (this.loaded == false) {
      const resp = await fetch(userListUrl);
      const data = await resp.json();

      if (resp.ok == true) {
        data.forEach((element) => {
          const newUser = new User(
            element.name,
            element.email,
            element.password,
            element.balance
          );

          this.users.push(newUser);
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

    const resp = await fetch(userListUrl, {
      method: "PUT",
      body: JSON.stringify(this.users),
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

  //Comprueba usuario y contraseña
  async checkCredential(email, password) {
    let returnValue = false;

    await this.loadFromServer();

    if (this.exist(email)) {
      const user = this.users.find((user) => {
        return user.email == email;
      });

      if (user.password == password) {
        returnValue = true;
      }
    }

    return returnValue;
  }

  //Comprueba que el usuario exista
  exist(email) {
    return this.users.some((user) => {
      return user.email == email;
    });
  }

  //Retorna el nombre del usuario
  async getName(email) {
    let returnName = "";

    await this.loadFromServer();

    if (this.exist(email)) {
      const user = this.users.find((user) => {
        return user.email == email;
      });

      returnName = user.name;
    }

    return returnName;
  }

  //Retorna el saldo del usuario
  async getBalance(email) {
    let returnBalance = "";

    await this.loadFromServer();

    if (this.exist(email)) {
      const user = this.users.find((user) => {
        return user.email == email;
      });

      returnBalance = user.balance;
    }

    return returnBalance;
  }

  //Actualiza el saldo del usuario
  async setBalance(email, balance) {
    let returnValue = false;

    await this.loadFromServer();

    if (this.exist(email)) {
      let i = this.users.findIndex((element) => {
        return element.email == email;
      });

      let prevBalance = this.users[i].balance;
      this.users[i].balance = balance;

      if ((await this.sendToServer()) == true) {
        returnValue = true;
      } else {
        this.users[i].balance = prevBalance;
      }
    }

    return returnValue;
  }
}

export const userList = new UserList();
