export default function alert(props) {
  return (
    <div className={"alert alert-icon alert-" + props.className} role="alert">
      <strong>{props.message}</strong>
    </div>
  );
}
