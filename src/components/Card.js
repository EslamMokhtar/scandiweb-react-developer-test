import { Component } from "react/cjs/react.production.min";
import { Link } from "react-router-dom";
import classes from "./Card.module.css";
import ImageGallery from "../shared/ImageGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faChevronCircleDown,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cartActions } from "../store/cart-slice";
import { connect } from "react-redux";
import AttributesButtons from "../shared/AttributesButtons";

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleAttributes = this.handleAttributes.bind(this);
    this.state = {
      attributes: [],
      isHovering: false,
      showError: false,
      clicked: false,
      showAttributes: false,
      addedToCart: false,
    };
  }
  handleAttributes(attribute, item) {
    this.manageAttributes(attribute, item);
  }
  handleMouseOver() {
    this.setState(() => ({
      isHovering: true,
    }));
  }

  handleMouseOut() {
    this.setState(() => ({
      showAttributes: false,
      isHovering: false,
      clicked: false,
      attributes: [],
    }));
  }

  switchIcons(attributes) {
    return attributes.length > 0 ? (
      <>
        <FontAwesomeIcon
          icon={faChevronCircleDown}
          size="lg"
          className={`${classes.icon1} ${
            this.state.clicked && classes.buttonClicked
          }`}
        />
        <FontAwesomeIcon
          icon={faCartPlus}
          size="lg"
          className={`${classes.icon2} ${
            this.state.clicked && classes.buttonClicked
          } ${this.state.addedToCart && classes.addedToCart}`}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="lg"
          className={`${classes.icon3} ${
            this.state.addedToCart && classes.addedToCart
          }`}
        />
      </>
    ) : (
      <>
        <FontAwesomeIcon
          icon={faCartPlus}
          size="lg"
          className={`${classes.icon2} ${classes.buttonClicked} ${
            this.state.addedToCart && classes.addedToCart
          }`}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="lg"
          className={`${classes.icon3} ${
            this.state.addedToCart && classes.addedToCart
          }`}
        />
      </>
    );
  }
  addProductHandler(attributes) {
    if (
      !this.state.clicked &&
      this.state.attributes.length !== attributes.length
    ) {
      return this.setState({ clicked: true, showAttributes: true });
    }
    if (this.state.attributes.length !== attributes.length) {
      this.setState({ showError: true });
      return setTimeout(() => this.setState({ showError: false }), 1000);
    }
    this.setState({ attributes: [], addedToCart: true });
    this.props.dispatch(
      cartActions.addProduct({
        ...this.props.product,
        quantity: 1,
        selectedAttributes: this.state.attributes,
      })
    );
    return setTimeout(() => this.setState({ addedToCart: false }), 1000);
  }
  manageAttributes(attribute, item) {
    this.setState((pre) => {
      const findAttribute = pre.attributes.find(
        (matchedAttribute) => matchedAttribute.name === attribute.name
      );
      const findAttributeIndex = pre.attributes.findIndex(
        (matchedAttribute) => matchedAttribute.name === attribute.name
      );
      let newArray;
      if (findAttribute) {
        newArray = [...pre.attributes];
        newArray[findAttributeIndex].value = item.displayValue;
      }
      return {
        attributes: findAttribute
          ? newArray
          : [
              ...pre.attributes,
              {
                name: attribute.name,
                value: item.displayValue,
              },
            ],
      };
    });
  }

  inStockCheck(inStock, gallery, name, id, attributes) {
    return !inStock ? (
      <Link to={`/${this.props.category}/products/${id}`}>
        <h2 className={classes.outOfStockText}>Out Of Stock</h2>
        <img src={gallery[0]} alt={name} />
      </Link>
    ) : (
      <>
        <ImageGallery
          hover={this.state.isHovering}
          images={gallery}
          haveLink={1}
          id={id}
          category={this.props.category}
        />
        <button
          className={classes.addButton}
          data-testid={id}
          onClick={this.addProductHandler.bind(this, attributes)}
        >
          {this.switchIcons(attributes)}
        </button>
      </>
    );
  }
  render() {
    const { attributes, id, gallery, inStock, name } = this.props.product;
    return (
      <div className={classes.column}>
        <div
          className={`${classes.card} ${!inStock && classes.outOfStock} ${
            this.state.showAttributes && classes.expandCard
          }`}
          onMouseEnter={this.handleMouseOver}
          onMouseLeave={this.handleMouseOut}
        >
          <div className={classes.content}>
            <div className={classes.profile}>
              {this.inStockCheck(inStock, gallery, name, id, attributes)}
            </div>

            <h2 className={classes.productName}>{name}</h2>
            <h4 className={classes.productPrice}>
              {this.props.symbol}
              {this.props.price}
            </h4>
          </div>
          <div
            className={`${classes.attributesButtons} ${
              this.state.showAttributes ? classes.showAttributes : ""
            }`}
          >
            <AttributesButtons
              attributes={attributes}
              showError={this.state.showError}
              inStock={inStock}
              selectedAttributes={this.state.attributes}
              manageAttributes={this.handleAttributes}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(Card);
