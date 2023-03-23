import React, { PureComponent } from "react";
export default class Header extends PureComponent {
  state = {
    mode: localStorage.getItem("themeMode"),
  };

  componentDidMount = () => {
    this.setMode(this.state.mode);
  };

  setMode = (mode) => {
    localStorage.setItem("themeMode", mode);
    if (mode === "light")
      document
        .getElementById("theme")
        .setAttribute("href", "/assets/css/theme.bundle.css");
    else
      document
        .getElementById("theme")
        .setAttribute("href", "/assets/css/theme-dark.bundle.css");
    this.setState({
      mode,
    });
  };

  render() {
    const { mode } = this.state;
    return (
      <div className="header">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-end">
              <div className="col">
                <h6 className="header-pretitle">{this.props.pretitle}</h6>
                <h1 className="header-title">{this.props.title}</h1>
              </div>
              <div className="col-auto">
                <div className="btn-group-toggle">
                  {mode === "dark" ? (
                    <label
                      className="btn btn-sm btn-white col"
                      onClick={() => this.setMode("light")}
                    >
                      <i className="fe fe-sun mr-2"></i> Light Mode
                    </label>
                  ) : (
                    <label
                      className="btn btn-sm btn-dark col"
                      onClick={() => {
                        this.setMode("dark");
                        window.location.reload();
                      }}
                    >
                      <i className="fe fe-moon mr-2"></i> Dark Mode
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
