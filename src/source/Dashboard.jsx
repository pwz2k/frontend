import React, { PureComponent } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import TopCard from "../components/TopCard";
import axios from "axios";
import { server, config } from "../env";
import { LineChart } from "../tools/helper";

export default class Dashboard extends PureComponent {
  state = {
    stats: {
      barcodes: 0,
      labels: 0,
    },
    chart: [],
  };

  componentDidMount = async () => {
    await axios(server + "/api/user/access", config)
      .then((rsp) => {
        if (!rsp.data.payload.superAccess) {
          this.props.history.push("/barcodes");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.readStats();
  };

  readStats = async (filter = "t") => {
    const e = document.getElementById("labels");
    var canvas = document.createElement("CANVAS");
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
    e.appendChild(canvas);
    canvas.classList.add("chart-canvas");
    await axios(server + "/api/user/dashboard?filter=" + filter, config).then(
      (rsp) => {
        this.setState({
          stats: rsp.data.payload.stats,
          chart: rsp.data.payload.chart,
        });
        const data = {
          labels: rsp.data.payload.chart.map((e) => e.label).reverse(),
          datasets: [
            {
              label: "Earned",
              data: rsp.data.payload.chart.map((e) => e.count).reverse(),
            },
          ],
        };
        LineChart(canvas, data);
      }
    );
  };

  render() {
    const { stats } = this.state;
    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Dashboard" />
        <div className="container-fluid">
          <div className="row">
            <TopCard
              title="Total Labels"
              value={stats.labels}
              icon="fe-tag"
              col={6}
            />
            <TopCard
              title="Available Balance"
              value={"$" + (stats.balance || 0)}
              icon="fe-code"
              col={6}
            />
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-header-title">Labels generated</h4>
                  <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link active"
                        data-bs-toggle="tab"
                        onClick={() => this.readStats("t")}
                      >
                        Today
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        data-bs-toggle="tab"
                        onClick={() => this.readStats("w")}
                      >
                        Week
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        data-bs-toggle="tab"
                        onClick={() => this.readStats("m")}
                      >
                        Month
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className="nav-link"
                        data-bs-toggle="tab"
                        onClick={() => this.readStats("y")}
                      >
                        Year
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  <div className="chart" id="labels"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
