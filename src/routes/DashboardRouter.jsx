import { BrowserRouter, Switch, Route } from "react-router-dom";

// Helper Components
import Sidebar from "../components/Sidebar";
import Balance from "../source/Balance";
import Barcodes from "../source/Barcodes";
import Dashboard from "../source/Dashboard";
import Labels from "../source/Labels";
import Settings from "../source/Settings";
import Stats from "../source/Stats";
import Ticket from "../source/Ticket";
import ApiDoc from "../source/Api";
import GeneateLabels from "../source/GeneateLabel";

export default function AuthRouter() {
  document.body.classList.remove("d-flex-grid");
  document.body.classList.remove("bg-auth");

  return (
    <BrowserRouter>
      <Sidebar />
      <Switch>
        <Route path="/api-documentation" component={ApiDoc} />
        <Route path="/tickets" component={Ticket} />
        <Route path="/balance" component={Balance} />
        <Route path="/website" component={Stats} />
        <Route path="/settings" component={Settings} />
        <Route path="/generate-label" component={GeneateLabels} />
        <Route path="/labels" component={Labels} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}
