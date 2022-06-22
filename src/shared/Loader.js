import { Component } from "react/cjs/react.production.min";
import classes from "./Loader.module.css";

class Loader extends Component {
  render() {
    return (
      <div className={classes.container}>
        <div className={classes.loader} />
      </div>
    );
  }
}

export default Loader;
