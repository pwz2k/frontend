import React, { Fragment, PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import TopCard from "../components/TopCard";

export default class Barcodes extends PureComponent {
  state = {
    barcodes: [],
    duplicateBarcodes: [],
    page: 1,
    totalPages: 1,
    loader: "",
    stats: {},

    uploadLoader: "",
    uploadMessage: "",

    selectedBarcodes: [],
    type: "",
    query: "",
    queryLoader: "",

    total: 0,
    uploaded: 0,
  };

  componentDidMount = () => {
    this.readBarcodes();
  };

  readBarcodes = async (page = 1, query = this.state.query) => {
    this.setState({
      page,
      loader: <Loader />,
    });
    await axios
      .get(server + "/api/admin/read-barcodes?page=" + page + query, config)
      .then((res) => {
        this.setState({
          barcodes: res.data.payload.barcodes,
          totalPages: Math.ceil(res.data.payload.totalBarcodes / 20),
          stats: res.data.payload.stats,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  upload = async (e) => {
    e.preventDefault();

    var barcodes = e.target.barcodes.value.split("\n");

    this.setState({
      uploadLoader: <Loader />,
      total: barcodes.length,
      uploaded: 0,
    });

    await axios
      .post(
        server + "/api/admin/upload-barcodes",
        {
          type: e.target.type.value,
          barcodes: barcodes,
        },
        config
      )
      .then((rsp) => {
        this.setState({
          duplicateBarcodes: rsp.data.payload,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.setState({
      uploaded: this.state.uploaded + 1,
    });

    this.readBarcodes(1);

    this.setState({
      uploadLoader: "",
      uploadMessage: (
        <Alert message="Barcodes added successfully." className="success" />
      ),
    });
  };

  selectBarcodes = (e) => {
    const selectedBarcodes = [...this.state.selectedBarcodes];
    if (e.target.checked) {
      selectedBarcodes.push(parseInt(e.target.value));
    } else {
      selectedBarcodes.splice(selectedBarcodes.indexOf(e.target.value), 1);
    }
    this.setState({ selectedBarcodes });
  };

  deleteBarcodes = async () => {
    const { selectedBarcodes } = this.state;
    if (selectedBarcodes.length > 0) {
      this.setState({
        loader: <Loader />,
      });
      await axios
        .post(
          server + "/api/admin/delete-barcodes",
          {
            barcodeIds: selectedBarcodes,
          },
          config
        )
        .then((res) => {
          this.readBarcodes(1);
          this.setState({
            loader: "",
            selectedBarcodes: [],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.deleteAllBarcodes(this.state.type);
    }
  };

  deleteAllBarcodes = async (type) => {
    this.setState({
      loader: <Loader />,
    });
    await axios
      .post(server + "/api/admin/delete-all-barcodes/" + type, {}, config)
      .then((res) => {
        this.readBarcodes(1);
        this.setState({
          loader: "",
          selectedBarcodes: [],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  search = async (e) => {
    e.preventDefault();

    this.setState({
      queryLoader: <Loader />,
    });

    var query = "&";

    if (e.target.search.value) {
      query += "search=" + e.target.search.value;
    }
    if (e.target.type.value) {
      query += "&type=" + e.target.type.value;
    }
    if (e.target.status.value) {
      query += "&status=" + e.target.status.value;
    }

    await this.readBarcodes(1, query);

    this.setState({
      query,
      queryLoader: "",
    });
  };

  render() {
    const { totalPages, page, barcodes, stats } = this.state;
    const { uploadLoader, uploadMessage, duplicateBarcodes } = this.state;
    const { selectedBarcodes } = this.state;
    const { total, uploaded } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Barcodes" />
        <div className="container-fluid">
          <div className="row">
            <TopCard
              title="Priority Left"
              value={stats.totalPriorityBarcodes}
              icon="fe-tag"
              col={4}
            />
            <TopCard
              title="Express Left"
              value={stats.totalExpressBarcodes}
              icon="fe-tag"
              col={4}
            />
            <TopCard
              title="First Class Left"
              value={stats.totalFirstClassBarcodes}
              icon="fe-tag"
              col={4}
            />
          </div>
          <div className="d-flex justify-content-between mb-3 w-100">
            <div>
              <button
                className="btn btn-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#uploadModal"
                onClick={() =>
                  this.setState({
                    duplicateBarcodes: [],
                  })
                }
              >
                Upload Barcodes
              </button>

              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteConfirmationModal"
              >
                Delete Barcodes
              </button>
            </div>
            <div>
              <form className="d-flex" onSubmit={this.search}>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="bg-transparent border border-primary rounded me-2 px-3 text-white"
                  placeholder="Search code"
                />

                <select
                  name="type"
                  className="bg-transparent border border-primary rounded me-2 px-3"
                  style={{
                    color: "gray",
                  }}
                >
                  <option value="all">All Barcodes</option>
                  <option value="priority">Priority</option>
                  <option value="express">Express</option>
                  <option value="firstclass">First Class</option>
                </select>

                <select
                  name="status"
                  className="bg-transparent border border-primary rounded me-2 px-3"
                  style={{
                    color: "gray",
                  }}
                >
                  <option value="">Good and Bad Status</option>
                  <option value="good">Good</option>
                  <option value="bad">Bad</option>
                </select>

                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-sm table-nowrap card-table">
                    <thead>
                      <tr>
                        <th>Select</th>
                        {/* <th>
                          <Link to="#" className="text-muted">
                            ID
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Username
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Email
                          </Link>
                        </th> */}
                        <th>
                          <Link to="#" className="text-muted">
                            Code
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Type
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Status
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Date
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Action
                          </Link>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {barcodes.map((barcode, index) => (
                        <tr key={barcode.id}>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={barcode.id}
                              onChange={this.selectBarcodes}
                            />
                          </td>
                          {/* <td>{barcode.id}</td>
                          <td>{barcode.adminName}</td>
                          <td>{barcode.adminEmail}</td> */}
                          <td>{barcode.ocrCode}</td>
                          <td>{barcode.type.toUpperCase()}</td>
                          <td>
                            {barcode.status === "bad" ? (
                              <span className="badge bg-danger">BAD</span>
                            ) : (
                              <span className="badge bg-success">GOOD</span>
                            )}
                          </td>
                          <td>{new Date(barcode.createdAt).toDateString()}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                this.setState(
                                  {
                                    selectedBarcodes: [barcode.id],
                                  },
                                  () => {
                                    this.deleteBarcodes();
                                  }
                                );
                              }}
                            >
                              Delete
                            </button>
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
                      onClick={() => this.readBarcodes(page - 1)}
                    >
                      <Link to="#" className="page-link">
                        Previous
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="page-item">
                    <Link to="#" className="page-link" href="#">
                      {page}
                    </Link>
                  </li>
                  {page < totalPages ? (
                    <li
                      className="page-item"
                      onClick={() => this.readBarcodes(page + 1)}
                    >
                      <Link to="#" className="page-link" href="#">
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

        {/* upload modal */}
        <Modal id="uploadModal" title="Upload Barcodes">
          <div className="modal-body">
            <form onSubmit={this.upload}>
              {uploadMessage}

              {uploadMessage && duplicateBarcodes.length > 0 && (
                <div className="form-group">
                  {/* duplicateBarcodes */}
                  <div className="alert alert-danger">
                    <strong>
                      {duplicateBarcodes.length} Duplicate/Bad Barcodes
                    </strong>
                    <ul>
                      {duplicateBarcodes.map((barcode, index) => (
                        <li key={index}>
                          {barcode.barcode} -{" "}
                          {new Date(barcode.lastDate).toDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="barcodes">Barcodes Type</label>
                <select name="type" id="type" className="form-control">
                  <option value="priority">Priority</option>
                  <option value="express">Express</option>
                  <option value="firstclass">First Class</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="barcodes">Barcodes</label>
                <textarea
                  name="barcodes"
                  id=""
                  cols="30"
                  rows="10"
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group">
                <button className="btn btn-primary">
                  <i className="fa fa-upload"></i> Upload ({total})
                  {uploadLoader}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* delete modal */}
        <Modal id="deleteConfirmationModal" title="Delete Barcodes">
          <div className="modal-body  text-center">
            <h3>Are you sure you want to delete?</h3>

            {selectedBarcodes.length === 0 && (
              <div className="form-group mb-3">
                <label htmlFor="">Choose Barcode Type</label>
                <select
                  name="type"
                  id="type"
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      selectedBarcodes: [],
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="priority">Priority</option>
                  <option value="express">Express</option>
                  <option value="firstclass">First Class</option>
                </select>
              </div>
            )}

            <div className="form-group mt-4">
              <button className="btn btn-primary m-2" data-bs-dismiss="modal">
                Go back
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteBarcodes}
                data-bs-dismiss="modal"
              >
                Continue
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
