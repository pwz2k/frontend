import React, { PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";

export default class Stats extends PureComponent {
  state = {
    stats: [],
    page: 1,
    totalPages: 1,

    loader: "",
    message: "",
  };

  componentDidMount = () => {
    this.readStats();
  };

  readStats = async () => {
    await axios
      .get(server + "/api/admin/stats/read", config)
      .then((res) => {
        this.setState({
          stats: res.data.payload,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateStats = async (e) => {
    e.preventDefault();
    this.setState({
      loader: <Loader />,
    });
    const form = e.target;
    const params = [
      {
        attr: "priority_weight",
        value: form.priority_weight.value,
      },
      {
        attr: "express_weight",
        value: form.express_weight.value,
      },
      {
        attr: "firstclass_weight",
        value: form.firstclass_weight.value,
      },
      {
        attr: "priority_minimum_stock",
        value: form.priority_minimum_stock.value,
      },
      {
        attr: "express_minimum_stock",
        value: form.express_minimum_stock.value,
      },
      {
        attr: "firstclass_minimum_stock",
        value: form.firstclass_minimum_stock.value,
      },
    ];

    await axios
      .post(server + "/api/admin/stats/update", { params }, config)
      .then((res) => {
        this.setState({
          loader: "",
          message: <Alert className="success" message={res.data.message} />,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { stats } = this.state;
    const { loader, message } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Website Controls" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={this.updateStats}>
                {message}
                <div className="row">
                  <div className="col-md-6">
                    <div className="row g-2">
                      <div className="card">
                        <div className="card-body">
                          {stats.map(
                            (s, i) =>
                              i < 3 && (
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="">
                                      {s.attr
                                        .replaceAll("_", " ")
                                        .toUpperCase()}
                                    </label>
                                    <input
                                      type="text"
                                      name={s.attr}
                                      className="form-control"
                                      defaultValue={s.value}
                                      required
                                    />
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row g-2">
                      <div className="card">
                        <div className="card-body">
                          {stats.map(
                            (s, i) =>
                              i > 2 && (
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="">
                                      {s.attr
                                        .replaceAll("_", " ")
                                        .toUpperCase()}
                                    </label>
                                    <input
                                      type="text"
                                      name={s.attr}
                                      className="form-control"
                                      defaultValue={s.value}
                                      required
                                    />
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Submit {loader}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
