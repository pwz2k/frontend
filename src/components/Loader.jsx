export default function Loader(props) {
  return (
    <div
      className={
        props.className
          ? "spinner-border d-inline-block " + props.className
          : "spinner-border d-inline-block spinner-border-sm"
      }
      role="status"
    >
      <span className="sr-only"></span>
    </div>
  );
}
