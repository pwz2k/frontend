import React, { PureComponent } from "react";
import Header from "../components/Header";
import axios from "axios";
import { server, config } from "../env";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
import DataList from "../components/DataList";

export default class Balance extends PureComponent {
  state = {
    balanceHistory: [],
    pager: {
      totalPage: 1,
      search: "",
      page: 1,
    },
    loader: "",
    message: "",
    addMessage: "",
    access: {},
  };

  componentDidMount = async () => {
    this.readAccess();
    this.readHistory();
  };

  readAccess = async () => {
    await axios
      .get(server + "/api/user/access", config)
      .then((rsp) => {
        this.setState({ access: rsp.data.payload });
      })
      .catch((err) => {});
  };

  readHistory = async (page = 1, search = "") => {
    const { pager } = this.state;
    pager.page = page;
    pager.search = search;
    this.setState({ pager });
    await axios
      .post(server + "/api/balance/read", pager, config)
      .then((rsp) => {
        this.setState({
          balanceHistory: rsp.data.payload,
          pager: {
            ...rsp.data.pager,
          },
        });
      })
      .catch((err) => {});
  };

  addBalance = async (e) => {
    e.preventDefault();

    const params = {
      amount: parseFloat(e.target.amount.value),
    };

    this.setState({ loader: <Loader /> });

    await axios
      .post(server + "/api/balance/create", params, config)
      .then((rsp) => {
        this.setState({
          addMessage: <Alert className="success" message="Success" />,
        });
        window.location.href = rsp.data.payload.paymentUrl;
      })
      .catch((err) => {
        this.setState({
          addMessage: (
            <Alert className="danger" message="Error while adding balance." />
          ),
        });
      });
  };

  render() {
    const { loader, addMessage, access, balanceHistory, pager } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Balance" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="password">Available Balance</label>
                  </div>
                  <h1 className="display-1 text-success">
                    ${access?.balance?.toFixed(2)}
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h3 htmlFor="password" className="text-center mb-3">
                    Add Balance
                  </h3>
                  <form onSubmit={this.addBalance}>
                    {addMessage}
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div className="form-group mb-0">
                      <button type="submit" className="btn btn-primary">
                        Add Balance {loader}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
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
                              Amount
                            </Link>
                          </th>
                          <th>
                            <Link to="#" className="text-muted">
                              Type
                            </Link>
                          </th>

                          {/* <th>
                            <Link to="#" className="text-muted">
                              Payment Method
                            </Link>
                          </th> */}
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
                        </tr>
                      </thead>
                      <tbody>
                        {balanceHistory.map((balance) => (
                          <tr key={balance.id}>
                            <td>{balance.id}</td>
                            <td>${balance.amount.toFixed(2)}</td>
                            <td>
                              {balance.type === "in" ? (
                                <span className="badge bg-success">CREDIT</span>
                              ) : (
                                <span className="badge bg-success">DEDIT</span>
                              )}
                            </td>
                            {/* <td>{balance.paymentMethod}</td> */}
                            <td>
                              {balance.status ? (
                                <span className="badge bg-success">Paid</span>
                              ) : (
                                <span className="badge bg-danger">
                                  Not Paid
                                </span>
                              )}
                            </td>
                            <td>
                              {new Date(balance.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  {pager.page > 1 && (
                    <li
                      className="page-item bg-light rounded"
                      onClick={() =>
                        this.readHistory(pager.page - 1, pager.search)
                      }
                    >
                      <Link to="#" className="page-link">
                        Previous
                      </Link>
                    </li>
                  )}

                  {pager.page > 1 && (
                    <li
                      className="page-item bg-light rounded"
                      onClick={() =>
                        this.readHistory(pager.page - 1, pager.search)
                      }
                    >
                      <Link to="#" className="page-link">
                        {pager.page - 1}
                      </Link>
                    </li>
                  )}

                  <li className="page-item bg-primary rounded">
                    <Link to="#" className="page-link">
                      {pager.page}
                    </Link>
                  </li>

                  {pager.totalPage > pager.page && (
                    <li
                      className="page-item bg-light rounded"
                      onClick={() => this.readHistory(pager.next, pager.search)}
                    >
                      <Link to="#" className="page-link">
                        {pager.page + 1}
                      </Link>
                    </li>
                  )}

                  {pager.totalPage > pager.page && (
                    <li
                      className="page-item bg-light rounded"
                      onClick={() =>
                        this.readHistory(pager.page + 1, pager.search)
                      }
                    >
                      <Link to="#" className="page-link">
                        Next
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
