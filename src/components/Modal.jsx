import React from "react";

export default function Modal(props) {
  return (
    <div className="modal fade" id={props.id} style={props.style}>
      <div className={props.className + " modal-dialog modal-dialog-centered"}>
        <div className="modal-content shadow-sm">
          <div className="modal-header p-4 border-0">
            <h3 className="pb-0 mb-0">{props.title}</h3>
            <span
              type="button"
              className="close text-danger"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close"
            >
              <span aria-hidden="true">&times;</span>
            </span>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
