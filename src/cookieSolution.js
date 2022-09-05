class CookieSolution {
  constructor() {
    this.purposes = [
      {
        id: "1",
        name: "Purpose 1",
      },
      {
        id: "2",
        name: "Purpose 2",
      },
      {
        id: "3",
        name: "Purpose 3",
      },
      {
        id: "4",
        name: "Purpose 4",
      },
    ];

    this.elements = [];
    this.cookie = undefined;
    this._domContentLoadedEvents();
  }

  /**
   * Runs the initialization on DOMContentLoaded
   *
   */
  _domContentLoadedEvents() {
    document.addEventListener("DOMContentLoaded", (event) => this._init());
  }

  /**
   * Initializes the class on page loaded
   *
   */
  _init() {
    this.elements = document.querySelectorAll("[data-cookie-solution]");

    this.cookie = this._getCookie();

    if (this.cookie) {
      this._setState(this.cookie);
      this._createFloatingButton();
    } else {
      this._setState();
      this._createBanner();
    }
  }

  /**
   * Returns the cookie
   *
   * @returns {object|undefined}
   */
  _getCookie() {
    const name = "cookie_solution";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return JSON.parse(parts.pop().split(";").shift());
    } else {
      return undefined;
    }
  }

  /**
   * Set the cookie with selected values
   *
   * @param {Array} values - Array of numbers (purposes id)
   */
  _setCookie(values) {
    const now = Date.now();

    let cookie = {};

    cookie.last_modified = now;
    cookie.acceptedCookies = values;

    document.cookie = `cookie_solution = ${JSON.stringify(cookie)}`;
  }

  /**
   * Creates the banner with options
   *
   * @param {boolean} [init] is the banner created on DOMContentLoaded
   * @param {Object} [cookie] Preferences saved in cookies
   */
  _createBanner(init = true, cookie) {
    const hash = Math.random().toString(36).substring(7);
    const bannerId = `cookie-solution-banner-${hash}`;
    const formId = `cookie-solution-form-${hash}`;

    let bannerElement = document.createElement("div");
    bannerElement.id = bannerId;

    let pElement = document.createElement("p");
    pElement.innerText =
      "We and selected third parties use cookies for technical purposes and, with your consent, for other purposes.";

    bannerElement.append(pElement);

    let formElement = document.createElement("form");
    formElement.id = formId;

    this.purposes.forEach((purpose) => {
      let purposeElement = document.createElement("label");
      const purposeName = `purpose${purpose.id}`;
      purposeElement.htmlFor = purposeName;
      let checked = false;

      if (cookie && cookie.acceptedCookies.includes(Number(purpose.id))) {
        checked = true;
      }

      purposeElement.innerHTML = `<input type="checkbox" name="${purposeName}" id="${purposeName}" value="${
        purpose.id
      }" ${checked ? "checked" : ""} /> ${purpose.name}`;

      formElement.append(purposeElement);
    });

    bannerElement.append(formElement);

    let buttonReject = document.createElement("button");
    buttonReject.name = "buttonReject";
    buttonReject.type = "button";
    buttonReject.innerText = "Reject";
    bannerElement.append(buttonReject);

    let buttonAccept = document.createElement("button");
    buttonAccept.name = "buttonAccept";
    buttonAccept.type = "button";
    buttonAccept.innerText = "Accept";
    buttonAccept.classList.add("btn-primary");
    bannerElement.append(buttonAccept);

    document.body.appendChild(bannerElement);

    let that = this;
    document
      .getElementById(bannerId)
      .querySelectorAll("button")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          switch (button.name) {
            case "buttonReject":
              that._setCookie([]);
              break;
            case "buttonAccept":
              let acceptedCookies = [];

              document
                .getElementById(formId)
                .querySelectorAll("[type='checkbox']")
                .forEach((purpose) => {
                  if (purpose.checked) {
                    acceptedCookies.push(Number(purpose.value));
                  }
                });

              that._setCookie(acceptedCookies);
          }

          this.cookie = this._getCookie();
          if (init) {
            this._setState(this.cookie);
          }
          this._createFloatingButton();
          bannerElement.remove();
        });
      });
  }

  /**
   * Creates the floating button
   *
   */
  _createFloatingButton() {
    const hash = Math.random().toString(36).substring(7);
    const buttonId = `cookie-solution-button-${hash}`;

    let buttonElement = document.createElement("button");
    buttonElement.id = buttonId;
    buttonElement.type = "button";
    buttonElement.innerText = "Edit preferences";

    document.body.appendChild(buttonElement);

    let that = this;
    buttonElement.addEventListener("click", (event) => {
      that._createBanner(false, this._getCookie());
      buttonElement.remove();
    });
  }

  /**
   * Sets the state of the elements in page starting from preferences
   *
   * @param {Object} [cookie] Preferences saved in cookies
   */
  _setState(cookie) {
    if (cookie == null) {
      this.elements.forEach(
        (element) => (element.dataset.cookieSolutionState = "waiting")
      );
    } else if (cookie.acceptedCookies.length === 0) {
      this.elements.forEach(
        (element) => (element.dataset.cookieSolutionState = "disabled")
      );
    } else {
      this.elements.forEach((element) => {
        let acceptedPurposes = JSON.parse(element.dataset.cookieSolution);

        if (typeof acceptedPurposes == "number") {
          let arrayPurposes = [];
          arrayPurposes.push(acceptedPurposes);
          acceptedPurposes = arrayPurposes;
        }

        let accepted;

        if (acceptedPurposes.includes(0)) {
          accepted = true;
        } else {
          accepted = acceptedPurposes.every((acceptedcookie) =>
            cookie.acceptedCookies.includes(acceptedcookie)
          );
        }

        element.dataset.cookieSolutionState = accepted ? "enabled" : "disabled";
      });
    }
  }
}
export default new CookieSolution();
