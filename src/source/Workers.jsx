import React, { PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";

export default class Workers extends PureComponent {
  state = {
    workers: [],
    page: 1,
    totalPages: 1,

    loader: "",
    message: "",
  };

  componentDidMount = () => {
    this.readWorkers();
  };

  readWorkers = async () => {
    await axios
      .get(server + "/api/admin/read-workers", config)
      .then((res) => {
        this.setState({
          workers: res.data.payload.workers,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  blockUnblockWorker = async (id) => {
    await axios
      .post(server + "/api/admin/block/" + id, {}, config)
      .then((rsp) => {
        this.readWorkers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  newWorker = async (e) => {
    e.preventDefault();

    this.setState({
      loader: <Loader />,
    });

    const params = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    await axios
      .post(server + "/api/admin/create-worker", params, config)
      .then((rsp) => {
        this.setState({
          message: (
            <Alert className="success" message="Worker Created Successfully" />
          ),
        });
        this.readWorkers();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          message: <Alert className="danger" message="Error Creating Worker" />,
        });
      });
    this.setState({
      loader: "",
    });
  };

  render() {
    const { workers } = this.state;
    const { loader, message } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Barcodes" />
        <div className="container-fluid">
          <div className="d-flex justify-content-end mb-3 w-100">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#newWorker"
            >
              + New Worker
            </button>
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
                            Username
                          </Link>
                        </th>
                        <th>
                          <Link to="#" className="text-muted">
                            Email
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
                            Actions
                          </Link>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {workers.map((worker) => (
                        <tr key={worker.id}>
                          <td>{worker.id}</td>
                          <td>{worker.username}</td>
                          <td>{worker.email}</td>
                          <td>
                            {worker.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Blocked</span>
                            )}
                          </td>
                          <td>{new Date(worker.createdAt).toDateString()}</td>
                          <td>
                            {worker.isActive ? (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  this.blockUnblockWorker(worker.id)
                                }
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  this.blockUnblockWorker(worker.id)
                                }
                              >
                                Unblock
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal id="newWorker" title="New Worker">
          <div className="modal-body">
            <form onSubmit={this.newWorker}>
              {message}
              <div className="form-group">
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Add Worker {loader}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}
