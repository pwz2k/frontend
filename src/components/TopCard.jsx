export default function TopCard(props) {
  return (
    <div className={"col-12 col-lg-" + props.col || "6"}>
      {/*"col-xl"*/}
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <h6 className="text-uppercase text-muted mb-2">{props.title}</h6>
              <span className="h2 mb-0">{props.value}</span>
            </div>
            <div className="col-auto">
              <span className={"h2 text-muted mb-0 fe " + props.icon}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
