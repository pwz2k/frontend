import React, { PureComponent } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import ApiRequests from "../tools/ApiRequests";
const apiRequests = new ApiRequests();

export default class Ticket extends PureComponent {
  state = {
    tickets: [],
    ticketMessages: [],
    pager: {
      totalPage: 1,
      search: "",
      page: 1,
    },
    ticket: {},
    action: "",
    statusMessage: "",
    createTicketMessage: "",
    createTicketLoader: "",
    statusLoader: "",
    sendMessage: "",
    sendLoader: "",
  };

  componentDidMount = () => {
    this.readTickets();
  };

  readTickets = async (
    page = this.state.pager.page,
    search = this.state.pager.search
  ) => {
    const { data, error } = await apiRequests.getTickets(page, search);
    if (!error)
      this.setState({
        tickets: data.tickets,
        pager: { ...data.pager },
      });
  };

  readTicketMessage = async (id) => {
    const { data, error } = await apiRequests.getTicket(id);
    if (!error)
      this.setState({ ticket: data.ticket, ticketMessages: data.messages });
  };

  sendMessage = async (e) => {
    e.preventDefault();
    this.setState({ sendLoader: <Loader /> });

    const { error } = await apiRequests.sendTicketMessage({
      id: this.state.ticket.id,
      message: e.target.message.value,
    });

    if (!error) {
      this.readTicketMessage(this.state.ticket.id);
      this.setState({
        sendMessage: <Alert className="success" message="Message sent" />,
      });
    } else {
      this.setState({
        sendMessage: <Alert className="danger" message="Error occured." />,
      });
    }

    this.setState({
      sendLoader: "",
    });
  };

  setTicketStatus = async () => {
    await apiRequests.setTicketStatus({
      id: this.state.ticket.id,
      status: this.state.action,
    });
    this.readTickets();
  };

  createTicket = async (e) => {
    e.preventDefault();
    this.setState({ createTicketLoader: <Loader /> });
    const { subject, message } = e.target;
    const error = await apiRequests.createTicket({
      subject: subject.value,
      message: message.value,
    });
    if (!error) {
      this.setState({
        createTicketMessage: (
          <Alert
            className="success"
            message="Ticket has been created successfully"
          />
        ),
      });
      this.readTickets();
    } else {
      this.setState({
        createTicketMessage: (
          <Alert className="danger" message="Error while creating ticket." />
        ),
      });
    }
    this.setState({ createTicketLoader: "" });
  };

  render() {
    const {
      tickets,
      ticketMessages,
      ticket,
      action,
      statusMessage,
      statusLoader,
      sendMessage,
      sendLoader,
      pager,
      createTicketLoader,
      createTicketMessage,
    } = this.state;

    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Tickets" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">All Tickets</div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#createTicket"
                  >
                    New Ticket
                  </button>
                </div>
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
                              Subject
                            </Link>
                          </th>
                          <th>
                            <Link to="#" className="text-muted">
                              Last Update
                            </Link>
                          </th>
                          <th>
                            <Link to="#" className="text-muted">
                              Last Message From
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
                              Action
                            </Link>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.subject}</td>
                            <td>{ticket.lastUpdate}</td>
                            <td>{ticket.lastMessageFrom}</td>
                            <td>
                              {ticket.status === "open" ? (
                                <span className="badge bg-success">Open</span>
                              ) : (
                                <span className="badge bg-danger">Closed</span>
                              )}
                            </td>
                            <td>{ticket.date}</td>

                            <td>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => {
                                  this.setState({
                                    ticket,
                                    action:
                                      ticket.status === "open"
                                        ? "open"
                                        : "close",
                                  });
                                  this.readTicketMessage(ticket.id);
                                }}
                                data-bs-toggle="modal"
                                data-bs-target="#message"
                              >
                                <i className="fe fe-message-square"></i>
                              </button>
                              {ticket.status === "open" ? (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() =>
                                    this.setState({ ticket, action: "close" })
                                  }
                                  data-bs-toggle="modal"
                                  data-bs-target="#setStatus"
                                >
                                  Close
                                </button>
                              ) : (
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() =>
                                    this.setState({ ticket, action: "open" })
                                  }
                                  data-bs-toggle="modal"
                                  data-bs-target="#setStatus"
                                >
                                  Open
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
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  {pager.page > 1 && (
                    <li
                      className="page-item bg-light rounded"
                      onClick={() =>
                        this.readTickets(pager.page - 1, pager.search)
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
                        this.readTickets(pager.page - 1, pager.search)
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
                      onClick={() => this.readTickets(pager.next, pager.search)}
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
                        this.readTickets(pager.page + 1, pager.search)
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

        {/* View Ticket Messages */}
        <Modal id="message" title={"Ticket Messages - " + ticket?.subject}>
          <div className="modal-body">
            {/* messages */}
            <div
              className="card border mb-3"
              style={{
                height: "400px",
                overflowY: "auto",
              }}
            >
              <div className="card-body">
                {ticketMessages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={
                        "row " +
                        (message.from !== "Admin" &&
                          "justify-content-end text-end")
                      }
                    >
                      <div
                        className="col-auto"
                        style={{
                          maxWidth: "80%",
                        }}
                      >
                        <div
                          className={`card border bg-${
                            message.from === "Admin" ? "primary" : "info"
                          } mb-2`}
                        >
                          <div className="card-body pb-1 px-2 pt-1 text-dark">
                            {message.message}
                            <p
                              className="p-0 m-0 text-gray"
                              style={{
                                fontSize: "8px",
                              }}
                            >
                              {new Date(message.date).toLocaleString()} -{" "}
                              {message.from === "Admin" ? "Admin" : "You"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* {action === "open" && ( */}
            <form onSubmit={this.sendMessage}>
              {sendMessage}
              <div className="form-group mb-3">
                <label htmlFor="name">Write Message</label>
                <textarea
                  name="message"
                  id="message"
                  cols="30"
                  rows="3"
                  className="form-control"
                  required
                ></textarea>
              </div>
              <div className="form-group text-end">
                <button type="submit" className="btn btn-primary">
                  Send Message {sendLoader}
                </button>
              </div>
            </form>
            {/* )} */}
          </div>
        </Modal>

        {/* Create Ticket */}
        <Modal id="createTicket" title="Create Ticket">
          <div className="modal-body">
            <form onSubmit={this.createTicket}>
              {createTicketMessage}
              <div className="form-group mb-3">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="subject">Message</label>
                <textarea
                  name="message"
                  id="message"
                  cols="30"
                  rows="5"
                  className="form-control"
                  required
                ></textarea>
              </div>
              <div className="form-group text-end mb-0">
                <button className="btn btn-primary">
                  Create Ticket {createTicketLoader}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Close/Open Ticket */}
        <Modal id="setStatus" title={action + " ticket"}>
          <div className="text-center">
            {statusMessage}
            <h3>Are you sure you want to {action} ticket?</h3>
            <div className="form-group mt-4">
              <button className="btn btn-primary m-2" data-bs-dismiss="modal">
                Go back
              </button>
              <button
                className="btn btn-danger"
                onClick={this.setTicketStatus}
                data-bs-dismiss="modal"
              >
                Continue {statusLoader}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
