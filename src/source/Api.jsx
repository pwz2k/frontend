import React, { PureComponent } from "react";
import Header from "../components/Header";
import { server, config } from "../env";
import axios from "axios";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const errorCodesJson = [
  {
    code: 1001,
    message: "Invalid API Key",
  },
  {
    code: 1002,
    message: "Invalid Label Type",
  },
  {
    code: 1003,
    message: "The fromName parameter is too long. Maximum length is 30",
  },
  {
    code: 1004,
    message: "Invalid parameters",
  },
  {
    code: 1005,
    message: "Invalid weight",
  },
  {
    code: 1006,
    message: "Price not available",
  },
  {
    code: 1007,
    message: "Insufficient balance in account",
  },
  {
    code: 1008,
    message: "Barcode not available, please try again later",
  },
  {
    code: 1009,
    message: "Label generation faild.",
  },
  {
    code: 1010,
    message: "Inernal server error",
  },
];

export default class ApiDoc extends PureComponent {
  constructor(props) {
    super(props);
    this.copy = React.createRef();
    this.regenerateBtn = React.createRef();
  }

  state = {
    apiKey: "",
    isLoaded: false,
    keyLoader: "",
  };

  componentDidMount = () => {
    this.readAccess();
  };

  readAccess = async () => {
    await axios
      .get(server + "/api/user/access", config)
      .then((rsp) => {
        this.setState({ apiKey: rsp.data.payload?.apiKey });
      })
      .catch((err) => {});
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
    const { keyLoader, apiKey } = this.state;
    console.log(apiKey);
    return (
      <div className="main-content">
        <Header pretitle="Overview" title="Api Documentation" />

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="mt-0 header-title api-title">API DOC</h4>
                  <p className="sub-title">
                    A complete guide to integrate API.
                  </p>
                  {/* API KEY */}
                  <div>
                    <span className="api-title">YOUR API KEY</span>
                    <pre>{apiKey}</pre>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      ref={this.copy}
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        this.copy.current.innerText = "Copied!";
                        this.copy.current.classList.add("btn-success");
                        setTimeout(() => {
                          this.copy.current.innerText = "Copy";
                          this.copy.current.classList.remove("btn-success");
                        }, 2000);
                      }}
                    >
                      Copy
                    </button>
                    <button
                      ref={this.regenerateBtn}
                      className="btn btn-sm btn-info"
                      onClick={this.resetKey}
                    >
                      Regenerate Key {keyLoader}
                    </button>
                  </div>

                  {/* BASE URL */}
                  <div className="mt-3">
                    <span className="api-title">BASE URL</span>
                    <pre>{server}</pre>
                  </div>
                </div>
              </div>

              {/* API AUTHENTICATIOn */}
              <div className="card">
                <div className="card-body">
                  <h4 className="mt-0 api-title">
                    API (Authentication/Headers)
                  </h4>
                  <p className="sub-title">
                    To access the API, you need to pass `x-api-key` parameter in
                    headers for each request.
                  </p>
                  <pre>
                    <code className="language-bash">x-api-key : {apiKey}</code>
                    <br />
                    <code className="language-bash">
                      Content-Type : application/json
                    </code>
                  </pre>
                </div>
              </div>

              {/* Create Label */}
              <div className="card">
                <div className="card-body">
                  <h4 className="mt-0 api-title">Generate Label</h4>
                  <p className="sub-title">
                    Follow given instructions to generate new label.
                  </p>
                  <h6 className="sub-title">Request</h6>
                  <pre>
                    <code className="language-bash">
                      url: {server}/api/label/generate <br />
                      type: <span className="text-warning">POST</span> <br />
                      headers: {`{ "x-api-key" : "${this.state.apiKey}" }`}{" "}
                      <br />
                      body:{" "}
                      {`
{
        type: "priority | express | firstclass",
        weight: 9,
        date: "09/30/2022",
        fromCountry: "USA",
        fromName: "Macintosh",
        fromRefNumber: "---OPTIONAL---",
        fromStreetNumber: "272 Tecumseh loop",
        fromStreetNumber2: "---OPTIONAL---",
        fromZip: "70570",
        fromCity: "Louisana",
        fromState: "LA",
        toCountry: "USA",
        toName: "Steave" ,
        toRefNumber: "---OPTIONAL---",
        toStreetNumber: "Opelousas",
        toStreetNumber2: "---OPTIONAL---",
        toZip: "70570",
        toCity: "Louisana",
        toState: "LA"
}
                      `}
                    </code>
                  </pre>

                  <h6 className="sub-title">Response</h6>
                  <pre>
                    {`{
    "message": "Label has been generated successfully!",
    "payload": {
        "id": 8,
        "code": "9114902200852075310054",
        "pdf": "${server}/labels/9114902200852075310054-1665335778918.pdf"
    },
    "pager": {}
}`}
                  </pre>
                </div>
              </div>

              {/* get label */}
              <div className="card">
                <div className="card-body">
                  <h4 className="mt-0 api-title">GET Label</h4>
                  <p className="sub-title">
                    Follow given instructions to generate new label.
                  </p>
                  <h6 className="sub-title">Request</h6>
                  <pre>
                    <code className="language-bash">
                      URL: {server}/api/label/read/{"<LABEL_ID>"} <br />
                      TYPE: <span className="text-success">GET</span> <br />
                      {/* HEADERS: {`{ "x-api-key" : "${this.state.apiKey}" }`} */}
                    </code>
                  </pre>

                  <h6 className="sub-title">Response</h6>
                  <pre>
                    {`{
    "message": "Label has been read successfully!",
    "payload": {
        "label": {
            "id": 8,
            "type": "priority",
            "weight": 15,
            "date": "2022-09-29T18:30:00.000Z",
            "fromCountry": "USA",
            "fromName": "Macintosh",
            "fromRefNumber": "",
            "fromStreetNumber": "272 Tecumseh loop",
            "fromZip": "70570",
            "fromCity": "Louisana",
            "fromState": "LA",
            "toCountry": "USA",
            "toName": "Steave",
            "toRefNumber": "904 Anthony ave",
            "toStreetNumber": "Opelousas",
            "toZip": "70570",
            "toCity": "Louisana",
            "toState": "LA",
            "barcodeOCR": "9114902200852075310054",
            "barcodeId": 1,
            "pdfPath": "${server}/labels/9114902200852075310054-1665335778918.pdf",
            "status": false,
            "statusMessage": null,
            "createdAt": "2022-10-09T17:16:20.000Z"
        }
    },
    "pager": {}
}`}
                  </pre>
                </div>
              </div>

              {/* ERROR CODES */}
              <div className="card">
                <div className="card-body">
                  <h4 className="mt-0 api-title">ERROR CODES</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>CODE</th>
                          <th>MESSAGE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorCodesJson.map((c) => (
                          <tr key={c.code}>
                            <td>{c.code}</td>
                            <td>{c.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
