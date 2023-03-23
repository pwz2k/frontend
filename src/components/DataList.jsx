import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { server, config } from "../env";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function DataList(props) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pager, setPager] = useState({
    page: 1,
    totalPages: 0,
    limit: props.pageSize || 10,
    search: props.search || "",
    searchField: props.searchField || "",
    sortBy: props.sortBy || "id",
    order: props.order || "asc",
    next: null,
    prev: null,
  });

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async (params = pager) => {
    setLoading(true);

    await axios
      .post(
        server + props.apiPath,
        {
          ...params,
        },
        config
      )
      .then((rsp) => {
        setItems([...rsp.data.payload]);
        setPager({
          ...rsp.data.pager,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    var topContainer = document.getElementById(props.topContainerId);
    if (topContainer) {
      topContainer.scrollTop = 0;
    }
  };

  const loadNextPage = () => {
    if (pager.next)
      getItems({
        ...pager,
        page: pager.next,
      });
  };

  const loadPrevPage = () => {
    if (pager.prev)
      getItems({
        ...pager,
        page: pager.prev,
      });
  };

  const selectItem = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((x) => x.id !== item.id));
    }
  };

  const onSelectAll = (e) => {
    if (e.target.checked) {
      props.setIsAllSelected(true);
      props.setSelectionCondition({
        ...pager,
      });
    } else {
      props.setIsAllSelected(false);
      props.setSelectionCondition({});
    }
    props.onChanges([]);
    setSelectedItems(e.target.checked ? [...items] : []);
  };

  const onSearch = (e) => {
    setPager({
      ...pager,
      search: e.target.value,
    });
  };

  return (
    <Fragment>
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-12">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-md"
                  placeholder="Search"
                  value={pager.search}
                  onChange={onSearch}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      getItems();
                    }
                  }}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getItems();
                    }}
                  >
                    <i className="fe fe-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-responsive">
            <table className="datalist table table-striped table-hover">
              <thead>
                <tr>
                  {props.options.map((option, index) => (
                    <th key={index}>{option}</th>
                  ))}
                  {props.action && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    {props.options.map((option, index) => (
                      <td key={index}>{item[option]}</td>
                    ))}
                    {props.action && <td>{props.action(item)}</td>}
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td
                      colSpan={props.options.length + 1}
                      className="text-center"
                    >
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}

          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadPrevPage}
                  >
                    Previous
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    to="#"
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadNextPage}
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
