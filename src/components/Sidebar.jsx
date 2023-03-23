import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { server, config } from "../env";

export default class Sidebar extends PureComponent {
  state = {
    tab: window.location.href.split("/")[3] || "/",
  };

  logout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  render() {
    const { tab, isAdmin } = this.state;

    return (
      <nav
        className="navbar navbar-vertical fixed-start navbar-expand-md navbar-light"
        id="sidebar"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapse"
            aria-controls="sidebarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* <Link className="navbar-brand" to="/">
            <img
              src={
                localStorage.getItem("themeMode") === "light"
                  ? "/logo2.png"
                  : "/logo1.png"
              }
              className="navbar-brand-img mx-auto"
              alt="..."
            />
          </Link> */}

          <div className="navbar-user d-md-none">
            <div className="dropdown">
              <Link
                to="#"
                id="sidebarIcon"
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="avatar avatar-sm avatar-online">
                  <img
                    src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                    className="avatar-img rounded-circle"
                    alt="..."
                  />
                </div>
              </Link>

              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="sidebarIcon"
              >
                <Link to="/settings" className="dropdown-item">
                  Settings
                </Link>
                <hr className="dropdown-divider" />
                <Link to="#" onClick={this.logout} className="dropdown-item">
                  Logout
                </Link>
              </div>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="sidebarCollapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className={tab === "/" ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ tab: "/" })}
                  to="/"
                >
                  <i className="fe fe-layout"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    tab === "generate-label" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => this.setState({ tab: "/generate-label" })}
                  to="/generate-label"
                >
                  <i className="fe fe-tag"></i> New Order
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={tab === "labels" ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ tab: "/labels" })}
                  to="/labels"
                >
                  <i className="fe fe-tag"></i> Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={tab === "balance" ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ tab: "/balance" })}
                  to="/balance"
                >
                  <i className="fe fe-dollar-sign"></i> Balance
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={tab === "tickets" ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ tab: "/tickets" })}
                  to="/tickets"
                >
                  <i className="fe fe-tag"></i> Tickets
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    tab === "api-documentation" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => this.setState({ tab: "/api-documentation" })}
                  to="/api-documentation"
                >
                  <i className="fe fe-code"></i> API
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    tab === "settings" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => this.setState({ tab: "/settings" })}
                  to="/settings"
                >
                  <i className="fe fe-settings"></i> Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#" onClick={this.logout}>
                  <i className="fe fe-log-out"></i> Logout
                </Link>
              </li>
            </ul>

            <div className="mt-auto"></div>

            <div className="navbar-user d-none d-md-flex" id="sidebarUser">
              <div className="dropup">
                <Link
                  to="#"
                  id="sidebarIconCopy"
                  className="dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="avatar avatar-sm avatar-online">
                    <img
                      src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                      className="avatar-img rounded-circle"
                      alt="..."
                    />
                  </div>
                </Link>

                <div
                  className="dropdown-menu"
                  aria-labelledby="sidebarIconCopy"
                >
                  {isAdmin ? (
                    <Link to="/settings" className="dropdown-item">
                      Settings
                    </Link>
                  ) : (
                    ""
                  )}
                  {isAdmin ? <hr className="dropdown-divider" /> : ""}
                  <Link to="#" onClick={this.logout} className="dropdown-item">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
