import { server, config } from "../env";
import axios from "axios";

export default class ApiRequests {
  async getTickets(page, search = "") {
    var data = [];
    var error = false;

    await axios
      .post(
        server + "/api/ticket/read",
        {
          page,
          search,
        },
        config
      )
      .then((res) => {
        data = res.data.payload;
      })
      .catch((err) => {
        error = true;
      });

    return { data, error };
  }

  async getTicket(id) {
    var data = {};
    var error = false;

    await axios
      .get(server + "/api/ticket/read/" + id, config)
      .then((res) => {
        data = res.data.payload;
      })
      .catch((err) => {
        error = true;
      });

    return { data, error };
  }

  async createTicket(data) {
    var error = false;

    await axios
      .post(server + "/api/ticket/create", data, config)
      .then((res) => {})
      .catch((err) => {
        error = true;
      });

    return error;
  }

  async sendTicketMessage(data) {
    var error = false;

    await axios
      .post(server + "/api/ticket/reply", data, config)
      .then((res) => {})
      .catch((err) => {
        error = true;
      });

    return error;
  }

  async setTicketStatus(data) {
    var error = false;

    var path = data.status === "open" ? "/open/" : "/close/";

    await axios
      .post(server + "/api/ticket/" + path + data.id, data, config)
      .then((res) => {})
      .catch((err) => {
        error = true;
      });

    return error;
  }

  async getPricing() {
    var data = [];
    var error = false;

    var path = "/api/pricing/read";

    await axios
      .get(server + path, config)
      .then((res) => {
        data = res.data.payload || [];
      })
      .catch((err) => {
        error = true;
      });

    return { data, error };
  }
}
