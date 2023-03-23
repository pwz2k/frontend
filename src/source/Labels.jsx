import React, { PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Labels extends PureComponent {
  state = {
    labels: [],
    page: 1,
    totalPages: 1,
    loader: "",
    label: {},
    message: "",

    date: new Date(),
    type: "priority",

    fromStreetNumber: "",
    fromStreetNumber2: "",
    fromZip: "",
    fromCity: "",
    fromState: "",
    fromCountry: "",

    toStreetNumber: "",
    toStreetNumber2: "",
    toZip: "",
    toCity: "",
    toState: "",
    toCountry: "",

    isFromAddressVerified: false,
    isToAddressVerified: false,
    apiKey: "",
    searchLoader: "",
  };

  componentDidMount = () => {
    this.readAccess();
    this.readLabels();
  };

  readAccess = async () => {
    await axios
      .get(server + "/api/user/access", config)
      .then((rsp) => {
        this.setState({ apiKey: rsp.data.payload?.apiKey });
      })
      .catch((err) => {});
  };

  readLabels = async (page = 1, search = "") => {
    this.setState({
      page,
      loader: <Loader />,
      searchLoader: <Loader />,
    });
    await axios
      .get(server + `/api/label/read?page=${page}&search=${search}`, config)
      .then((res) => {
        this.setState({
          labels: res.data.payload.labels,
          totalPages: Math.ceil(res.data.payload.totalLabels / 20),
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      loader: "",
      searchLoader: "",
    });
  };

  generateLabel = async (e) => {
    e.preventDefault();
    this.setState({
      loader: <Loader />,
    });

    const form = new FormData(e.target);
    const data = {};
    form.forEach((value, key) => {
      data[key] = value;
    });
    data.date = this.state.date;

    // format date in MM-DD-YYYY format
    const date = new Date(data.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    data.date = month + "-" + day + "-" + year;

    await axios
      .post(server + "/api/label/generate", data, {
        headers: {
          "x-api-key": this.state.apiKey,
        },
      })
      .then((res) => {
        this.setState({
          message: <Alert className="success" message={res.data.message} />,
        });
        this.readLabels();
      })
      .catch((err) => {
        this.setState({
          message: (
            <Alert className="danger" message={err.response?.data?.message} />
          ),
        });
      });

    this.setState({
      loader: "",
    });
  };

  onChange = (e) => {
    const { name, value } = e.target;
    if (name === "toZip" || name === "fromZip") {
      var code = "";
      if (value.includes("-") && value.length > 5) {
        code = value;
      } else if (value.includes("-") && value.length <= 5) {
        code = value.replaceAll("-", "");
      } else if (!value.includes("-") && value.length > 5) {
        code = value.substring(0, 5) + "-" + value.substring(5, value.length);
      } else if (!value.includes("-") && value.length < 5) {
        code = value;
      } else {
        code = value;
      }

      this.setState({
        [name]: code,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  verifyAddress = async (street1, street2, city, state, zip, type = "from") => {
    const obj = {};
    if (street1) obj.street1 = street1;
    if (street2) obj.street2 = street2;
    if (city) obj.city = city;
    if (state) obj.state = state;
    if (zip) obj.zip = zip;

    if (type === "from") {
      this.setState({
        isFromAddressVerified: false,
      });
    }

    this.setState({
      message: <Alert className="info" message="Processing..." />,
    });

    await axios
      .post(
        server + "/api/usps/address",
        {
          ...obj,
        },
        config
      )
      .then((res) => {
        if (res.data.payload) {
          if (type === "from") {
            this.setState({
              isFromAddressVerified: true,
            });
          } else {
            this.setState({
              isToAddressVerified: true,
            });
          }
        } else {
          if (type === "from") {
            this.setState({
              isFromAddressVerified: false,
            });
          } else {
            this.setState({
              isToAddressVerified: false,
            });
          }
        }
      })
      .catch((err) => {});
    this.setState({
      message: "",
    });
  };

  zipCodeLookup = async (city, state, street1, street2, type = "from") => {
    console.log(city, state, street1, street2);
    if (!city) return;
    if (!state) return;
    if (!street1) return;

    const obj = {};
    if (street1) obj.street1 = street1;
    if (street2) obj.street2 = street2;
    if (city) obj.city = city;
    if (state) obj.state = state;

    this.setState({
      message: <Alert className="info" message="Processing..." />,
    });

    var result = {};
    await axios
      .post(
        server + "/api/usps/zipcode",
        {
          ...obj,
        },
        config
      )
      .then((res) => {
        if (res.data.payload) {
          result = res.data.payload;
          this.setState({
            message: "",
          });
        } else {
          this.setState({
            message: <Alert className="danger" message="Invalid Address" />,
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: <Alert className="danger" message="Invalid Address" />,
        });
      });

    const zip = result.zip;

    console.log(zip);

    if (type === "from" && result) {
      this.setState({
        fromZip: zip?.endsWith("-") ? zip?.slice(0, 5) : zip,
      });
    }
    if (type === "to" && result) {
      this.setState({
        toZip: zip?.endsWith("-") ? zip?.slice(0, 5) : zip,
      });
    }
  };

  cityStateLookup = async (zip, type = "form") => {
    if (zip.length !== 5) return;

    var result;
    const obj = {
      zip: zip.replaceAll("-", ""),
    };

    await axios
      .post(
        server + "/api/usps/city-state",
        {
          ...obj,
        },
        config
      )
      .then((res) => {
        if (res.data.payload) {
          result = res.data.payload;
          console.log(res.data.payload);
        }
      })
      .catch((err) => {});

    if (type === "from") {
      this.setState({
        fromCity: result.city,
        fromState: result.state,
      });
    }
    if (type === "to") {
      this.setState({
        toCity: result.city,
        toState: result.state,
      });
    }
  };

  render() {
    const { totalPages, page, date, labels, label } = this.state;
    const { loader, message, searchLoader } = this.state;

    const {
      type,
      fromStreetNumber,
      fromStreetNumber2,
      fromZip,
      fromCity,
      fromState,
      fromCountry,

      toStreetNumber,
      toStreetNumber2,
      toZip,
      toCity,
      toState,
      toCountry,
    } = this.state;

    const { isFromAddressVerified, isToAddressVerified } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Labels" />
        <div className="container-fluid">
          <div className="d-flex justify-content-end mb-3 w-100">
            {/* <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#generateLabel"
            >
              Generate Label
            </button> */}
            <div className="form-group m-0">
              <input
                type="text"
                className="form-control w-100 border"
                placeholder="Search..."
                onChange={(e) => this.readLabels(1, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-sm table-nowrap card-table">
                    <thead>
                      <tr>
                        <th>
                          <Link to="#" className="text-muted">
                            ID
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Type
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Weight
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            From Name
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Tracking CODE
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Date
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Status
                          </Link>
                        </th>
                        {/* <th>
                          <Link to="#" className="text-muted">
                            Summery
                          </Link>
                        </th> */}
                        <th>
                          <Link to="#" className="text-muted">
                            Action
                          </Link>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {labels.map((label, index) => (
                        <tr key={label.id}>
                          <td>{label.id}</td>
                          <td>{label.type}</td>
                          <td>{label.weight} lb</td>
                          <td>{label.fromName} lb</td>
                          <td>{label.barcodeOCR}</td>
                          <td>{new Date(label.createdAt).toDateString()}</td>
                          <td>
                            {label.status ? (
                              <span className="badge bg-success">
                                Delivered
                              </span>
                            ) : JSON.parse(label.statusMessage || "[]")
                                .length === 0 ? (
                              <span className="badge bg-warning">
                                Awaiting scan or not yet in system
                              </span>
                            ) : (
                              <span className="badge bg-info">In Progress</span>
                            )}
                          </td>
                          {/* <td>
                            {JSON.parse(label.statusMessage).length > 0 &&
                              JSON.parse(label.statusMessage)[0]}
                          </td> */}

                          <td>
                            <button
                              className="btn btn-sm btn-primary me-1"
                              data-bs-toggle="modal"
                              data-bs-target="#viewLabel"
                              onClick={() =>
                                this.setState({
                                  label: { ...label },
                                })
                              }
                            >
                              View
                            </button>
                            <a
                              className="btn btn-sm btn-primary"
                              href={server + label.pdfPath}
                              download
                            >
                              Download PDF
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  {page > 1 ? (
                    <li
                      className="page-item"
                      onClick={() => this.readLabels(page - 1)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => this.readLabels(page - 1)}
                      >
                        Previous
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="page-item">
                    <Link to="#" className="page-link" href="#">
                      {searchLoader || page}
                    </Link>
                  </li>
                  {page < totalPages ? (
                    <li
                      className="page-item"
                      onClick={() => this.readLabels(page + 1)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => this.readLabels(page + 1)}
                      >
                        Next
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <Modal id="generateLabel" title="Read Label" className="modal-lg">
          <div className="modal-body">
            <form onSubmit={this.generateLabel}>
              {!isFromAddressVerified || !isToAddressVerified ? (
                <Alert
                  className="danger"
                  message="Addresses are not verified."
                />
              ) : (
                <Alert className="info" message="Addresses are  verified." />
              )}
              {message}
              {/* Top ROw */}
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="">Type</label>
                    <select
                      name="type"
                      id="type"
                      className="form-control"
                      required
                      onChange={(e) =>
                        this.setState({
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="priority">Priority</option>
                      <option value="express">Express</option>
                      <option value="firstclass">First Class</option>
                      <option value="signature">Signature</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="">
                      Weight ({type === "firstclass" ? "oz" : "lb"})
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="">Date</label>
                    <DatePicker
                      selected={date}
                      onChange={(date) => this.setState({ date })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                {/* from name */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Name</label>
                    <input
                      type="text"
                      name="fromName"
                      id="fromName"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* fromRefNumber */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Reference Number</label>
                    <input
                      type="text"
                      name="fromRefNumber"
                      id="fromRefNumber"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* fromStreetNumber */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Street Number</label>
                    <input
                      type="text"
                      name="fromStreetNumber"
                      id="fromStreetNumber"
                      className="form-control"
                      value={fromStreetNumber}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          fromCity,
                          fromState,
                          e.target.value,
                          fromStreetNumber2,
                          fromZip,
                          "from"
                        );
                        this.verifyAddress(
                          e.target.value,
                          fromStreetNumber2,
                          fromCity,
                          fromState,
                          "from"
                        );
                      }}
                      required
                    />
                  </div>
                </div>

                {/* fromStreetNumber2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Street Number 2</label>
                    <input
                      type="text"
                      name="fromStreetNumber2"
                      id="fromStreetNumber2"
                      className="form-control"
                      value={fromStreetNumber2}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          fromCity,
                          fromState,
                          fromStreetNumber,
                          e.target.value,
                          fromZip,
                          "from"
                        );
                        this.verifyAddress(
                          fromStreetNumber,
                          e.target.value,
                          fromCity,
                          fromState,
                          "from"
                        );
                      }}
                    />
                  </div>
                </div>

                {/* fromCity */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From City</label>
                    <input
                      type="text"
                      name="fromCity"
                      id="fromCity"
                      className="form-control"
                      value={fromCity}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          e.target.value,
                          fromState,
                          fromStreetNumber,
                          fromStreetNumber2,
                          "from"
                        );
                        this.verifyAddress(
                          fromStreetNumber,
                          fromStreetNumber2,
                          e.target.value,
                          fromState,
                          fromZip,
                          "from"
                        );
                      }}
                      required
                    />
                  </div>
                </div>

                {/* fromState */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From State</label>
                    <input
                      type="text"
                      name="fromState"
                      id="fromState"
                      className="form-control"
                      value={fromState}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          fromCity,
                          e.target.value,
                          fromStreetNumber,
                          fromStreetNumber2,
                          fromZip,
                          "from"
                        );
                        this.verifyAddress(
                          fromStreetNumber,
                          fromStreetNumber2,
                          fromCity,
                          e.target.value,
                          "from"
                        );
                      }}
                      maxLength={2}
                      required
                    />
                  </div>
                </div>

                {/* fromZip */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Zip</label>
                    <input
                      type="text"
                      name="fromZip"
                      id="fromZip"
                      value={fromZip}
                      onChange={(e) => {
                        this.onChange(e);
                        this.cityStateLookup(e.target.value, "from");
                        this.verifyAddress(
                          fromStreetNumber,
                          fromStreetNumber2,
                          fromCity,
                          fromState,
                          e.target.value,
                          "from"
                        );
                      }}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* fromCountry */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">From Country</label>
                    <input
                      type="text"
                      name="fromCountry"
                      id="fromCountry"
                      className="form-control"
                      value={fromCountry}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                </div>

                {/* toName */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Name</label>
                    <input
                      type="text"
                      name="toName"
                      id="toName"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* toRefNumber */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Reference Number</label>
                    <input
                      type="text"
                      name="toRefNumber"
                      id="toRefNumber"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* toStreetNumber */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Street Number</label>
                    <input
                      type="text"
                      name="toStreetNumber"
                      id="toStreetNumber"
                      className="form-control"
                      value={toStreetNumber}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          toCity,
                          toState,
                          e.target.value,
                          toStreetNumber2,
                          "to"
                        );
                        this.verifyAddress(
                          e.target.value,
                          toStreetNumber2,
                          toCity,
                          toState,
                          toZip,
                          "to"
                        );
                      }}
                      required
                    />
                  </div>
                </div>

                {/* toStreetNumber2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Street Number 2</label>
                    <input
                      type="text"
                      name="toStreetNumber2"
                      id="toStreetNumber2"
                      className="form-control"
                      value={toStreetNumber2}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          toCity,
                          toState,
                          toStreetNumber,
                          e.target.value,
                          "to"
                        );
                        this.verifyAddress(
                          toStreetNumber,
                          e.target.value,
                          toCity,
                          toState,
                          toZip,
                          "to"
                        );
                      }}
                    />
                  </div>
                </div>

                {/* toCity */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To City</label>
                    <input
                      type="text"
                      name="toCity"
                      id="toCity"
                      className="form-control"
                      value={toCity}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          e.target.value,
                          toState,
                          toStreetNumber,
                          toStreetNumber2,
                          "to"
                        );
                        this.verifyAddress(
                          toStreetNumber,
                          toStreetNumber2,
                          e.target.value,
                          toState,
                          toZip,
                          "to"
                        );
                      }}
                      required
                    />
                  </div>
                </div>

                {/* toState */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To State</label>
                    <input
                      type="text"
                      name="toState"
                      id="toState"
                      className="form-control"
                      value={toState}
                      onChange={(e) => {
                        this.onChange(e);
                        this.zipCodeLookup(
                          toCity,
                          e.target.value,
                          toStreetNumber,
                          toStreetNumber2,
                          "to"
                        );
                        this.verifyAddress(
                          toStreetNumber,
                          toStreetNumber2,
                          toCity,
                          e.target.value,
                          toZip,
                          "to"
                        );
                      }}
                      maxLength={2}
                      required
                    />
                  </div>
                </div>

                {/* toZip */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Zip</label>
                    <input
                      type="text"
                      name="toZip"
                      id="toZip"
                      className="form-control"
                      value={toZip}
                      onChange={(e) => {
                        this.onChange(e);
                        this.cityStateLookup(e.target.value, "to");
                        this.verifyAddress(
                          toStreetNumber,
                          toStreetNumber2,
                          toCity,
                          toState,
                          e.target.value,
                          "to"
                        );
                      }}
                      required
                    />
                  </div>
                </div>

                {/* toCountry */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="">To Country</label>
                    <input
                      type="text"
                      name="toCountry"
                      id="toCountry"
                      className="form-control"
                      value={toCountry}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-primary">
                      Generate Label {loader}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>

        <Modal id="viewLabel" title="Read Label" className="modal-lg">
          <div className="modal-body">
            {/* table */}
            <div className="table-responsive">
              <table className="table table-sm table-nowrap card-table">
                <thead>
                  {Object.keys(label).map((key, index) => (
                    <tr>
                      <th key={index}>{key}</th>
                      <th key={index}>
                        {key === "statusMessage" ? (
                          <ul>
                            {JSON.parse(label[key] || "[]").length > 0 &&
                              JSON.parse(label[key]).map((item) => (
                                <li>{item}</li>
                              ))}
                          </ul>
                        ) : (
                          label[key]
                        )}
                      </th>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
