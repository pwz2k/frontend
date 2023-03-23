import React, { PureComponent } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { server, config } from "./env";

// Componenets
import PageLoader from "./components/PageLoader";

// Routes
import AuthRouter from "./routes/AuthRouter";
import DashboardRouter from "./routes/DashboardRouter";

class App extends PureComponent {
  state = {
    token: Cookies.get("token"),
    isLogin: false,
    isAllLoaded: false,
  };

  componentDidMount = async () => {
    await this.checkUserLogin(this.state.token);
  };

  checkUserLogin = async (token) => {
    await axios(server + "/api/user/access", config)
      .then((rsp) => {
        this.setState({
          isAllLoaded: true,
          isLogin: true,
        });
      })
      .catch((err) => {
        this.setState({
          isAllLoaded: true,
          isLogin: false,
        });
      });
  };

  render() {
    const { isLogin, isAllLoaded } = this.state;
    return isAllLoaded ? (
      <BrowserRouter>
        {isLogin ? (
          <Switch>
            <Route path="/" component={DashboardRouter} />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" component={AuthRouter} />
          </Switch>
        )}
      </BrowserRouter>
    ) : (
      <PageLoader />
    );
  }
}

export default App;
