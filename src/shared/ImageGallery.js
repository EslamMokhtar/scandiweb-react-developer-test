import { Link } from "react-router-dom";
import { Component } from "react/cjs/react.production.min";
import classes from "./ImageGallery.module.css";

class ImageGallery extends Component {
  constructor() {
    super();
    this.state = {
      current: 0,
    };
  }
  nextHandler() {
    if (this.state.current + 1 === this.props.images.length) {
      return this.setState({ current: 0 });
    }
    this.setState((pre) => {
      return { current: pre.current + 1 };
    });
  }

  preHandler() {
    if (this.state.current === 0) {
      return this.setState({ current: this.props.images.length - 1 });
    }
    this.setState((pre) => {
      return { current: pre.current - 1 };
    });
  }
  image(item, index) {
    return (
      <div
        className={`${classes.fade} ${
          this.state.current === index ? " " : classes.mySlides
        }`}
        key={index}
      >
        {this.props.haveLink ? (
          <Link to={`/${this.props.category}/products/${this.props.id}`}>
            <img src={item} alt={this.props.id} />
          </Link>
        ) : (
          <img src={item} alt={this.props.id} />
        )}
      </div>
    );
  }
  render() {
    return (
      <>
        {this.props.images.map((item, index) => this.image(item, index))}

        {this.props.images.length > 1 && this.props.hover && (
          <div className={classes.buttons}>
            <button className={classes.prev} onClick={this.preHandler.bind(this)}>
              &#10094;
            </button>

            <button className={classes.next} onClick={this.nextHandler.bind(this)}>
              &#10095;
            </button>
          </div>
        )}
      </>
    );
  }
}

export default ImageGallery;
