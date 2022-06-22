import { Component } from "react/cjs/react.production.min";
import classes from "./Error.module.css";

class Loader extends Component {
  render(props) {
    return (
      <div className={classes.container}>
        <lottie-player
          src="https://assets4.lottiefiles.com/packages/lf20_GlZGOi.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px" }}
          autoplay
        />
        <h1>{this.props.message}</h1>
      </div>
    );
  }
}

export default Loader;
