export class CurrentUser {
  constructor() {
    this.email = "";
  }

  //Lee del local storage el usuario actual
  load() {
    const email = localStorage.getItem("currentUserEmail");

    if (email != null && email != "") {
      this.email = email;
      this.loaded = true;
    }
  }

  //Setea el usuario actual. "" = no hay usuario logueado
  setEmail(email) {
    localStorage.setItem("currentUserEmail", email);
  }

  getEmail() {
    this.email = localStorage.getItem("currentUserEmail");
    return this.email;
  }

  //Verifica si hay un usuario logueado
  isValid() {
    let returnValue = false;

    const email = localStorage.getItem("currentUserEmail");
    if (email != null && email != "") {
      returnValue = true;
    }

    return returnValue;
  }
}

export const currentUser = new CurrentUser();
