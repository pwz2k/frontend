const Cookies = require("js-cookie");

module.exports = {
  // server: window.location.href.includes("localhost")
  //   ? "http://localhost:7400"
  //   : "https://api.labelaxxess.com",

  server: "https://api.labelaxxess.com",

  config: {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  },

  // recaptcha keys
  RECAPTCHA_KEY: "6LdG1AMjAAAAAOeHyOPzPV5zBbStTqiyXrkfu91r",
  checkAccess: (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        Cookies.remove("footprint");
        window.location.href = "/";
      }
    }
    return true;
  },
};
