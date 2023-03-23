import { BrowserRouter, Switch, Route } from "react-router-dom";

// Components
import Login from "../auth/Login";
import Confirm from "../auth/Confirm";

export default function AuthRouter() {
  document.body.classList.add("d-flex-grid");
  document.body.classList.add("bg-auth");
  return (
    <BrowserRouter>
      <div className="container">
        <div className="row justify-content-center">
          <Switch>
            {/* <Route path="/Confirm" component={Confirm} /> */}
            <Route path="/" component={Login} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}
