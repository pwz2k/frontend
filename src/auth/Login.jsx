import React, { PureComponent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { server, RECAPTCHA_KEY } from "../env";

// helper components
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Recaptcha from "react-google-invisible-recaptcha";

export default class Login extends PureComponent {
  state = {
    showPassword: false,
    loader: "",
    message: "",
    reCaptcha: null,
  };

  componentDidMount = () => {
    document.title = "Login";
  };

  handlePasswordVisiblity = () => {
    this.setState({
      showPassword: this.state.showPassword ? false : true,
    });
  };

  login = async (e) => {
    e.preventDefault();

    this.setState({
      loader: <Loader />,
    });

    await this.recaptcha.execute();

    const params = {
      username: e.target.username.value,
      password: e.target.password.value,
      "g-recaptcha-response": this.state.reCaptcha,
    };

    await axios
      .post(server + "/api/user/login", params)
      .then((rsp) => {
        Cookies.set("token", rsp.data.payload.token);
        this.setState({
          loader: "",
          message: <Alert className="success" message={rsp.data.message} />,
        });
        window.location.href = "/";
      })
      .catch((err) => {
        if (err.response) {
          this.setState({
            message: (
              <Alert className="danger" message={err.response.data.message} />
            ),
          });
        }
        this.setState({
          loader: "",
        });
      });
  };

  onResolved = () => {
    this.setState({ reCaptcha: this.recaptcha.getResponse() });
  };

  render() {
    const { showPassword, loader, message } = this.state;
    return (
      <div className="col-12 col-md-5 col-xl-4 my-5">
        <h1 className="display-4 text-center mb-3">Log-In</h1>

        <p className="text-muted text-center mb-5">Welcome Back</p>

        <form onSubmit={this.login}>
          {message}
          <div className="form-group">
            <label className="form-label"> Username </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              name="username"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col">
                <label className="form-label"> Password </label>
              </div>
            </div>

            <div className="input-group input-group-merge">
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                required
              />

              <span
                className="input-group-text"
                onClick={this.handlePasswordVisiblity}
              >
                {showPassword ? (
                  <i className="fe fe-eye-off"></i>
                ) : (
                  <i className="fe fe-eye"></i>
                )}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-lg w-100 btn-primary mb-3">
            Log In {loader}
          </button>
        </form>
        <Recaptcha
          ref={(ref) => (this.recaptcha = ref)}
          sitekey={RECAPTCHA_KEY}
          onResolved={this.onResolved}
        />
      </div>
    );
  }
}
