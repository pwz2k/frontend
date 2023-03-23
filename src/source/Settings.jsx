import React, { PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

export default class Settings extends PureComponent {
  state = {
    loader: "",
    loaderKey: "",
    message: "",
    messageKey: "",
    access: {},
  };

  componentDidMount = async () => {
    this.readAccess();
  };

  readAccess = async () => {
    await axios
      .get(server + "/api/user/access", config)
      .then((rsp) => {
        this.setState({ access: rsp.data.payload });
      })
      .catch((err) => {});
  };

  update = async (e) => {
    e.preventDefault();

    this.setState({
      loader: <Loader />,
    });

    const params = {
      password: e.target.password.value,
    };

    await axios
      .post(server + "/api/user/update-password", params, config)
      .then((rsp) => {
        this.setState({
          message: <Alert className="success" message={rsp.data.message} />,
        });
      })
      .catch((err) => {
        this.setState({
          message: (
            <Alert
              className="danger"
              message={
                err.response?.data.message || "Error while updating password"
              }
            />
          ),
        });
      });
    this.setState({
      loader: "",
    });
  };

  resetKey = async (e) => {
    e.preventDefault();

    this.setState({
      loaderKey: <Loader />,
    });

    await axios
      .post(server + "/api/user/generateKey", {}, config)
      .then((rsp) => {
        this.setState({
          messageKey: (
            <Alert className="success" message="Key Reset Successful." />
          ),
        });
        this.readAccess();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          messageKey: (
            <Alert className="danger" message="Error resetting the key" />
          ),
        });
      });
    this.setState({
      loaderKey: "",
    });
  };

  render() {
    const { loader, loaderKey, message, messageKey, access } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Settings" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={this.update}>
                    {message}
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="New Password"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">
                        Update Password {loader}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={this.resetKey}>
                    {messageKey}
                    <div className="form-group">
                      <label htmlFor="password">API KEY</label>
                      <input
                        type="text"
                        className="form-control"
                        value={access.apiKey}
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">
                        Reset Key {loaderKey}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
