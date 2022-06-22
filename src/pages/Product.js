import { Component } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import { cartActions } from "../store/cart-slice";
import classes from "./Product.module.css";
import parse from "html-react-parser";
import axios from "axios";
import Loader from "../shared/Loader";
import AttributesButtons from "../shared/AttributesButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { GET_PRODUCT } from "../utils/graphql/queries/productQueries";
import Error from "../shared/Error";

class Product extends Component {
  constructor() {
    super();
    this.manageAttributes = this.manageAttributes.bind(this);
    this.handleAttributes = this.handleAttributes.bind(this);
    this.state = {
      current: 0,
      product: null,
      attributes: [],
      showError: false,
      addedToCart: false,
      loading: true,
    };
  }
  componentDidMount() {
    const pid = this.props.pid;
    axios({
      url: "http://localhost:4000",
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(GET_PRODUCT(pid)),
    })
      .then((response) => {
        this.setState({
          product: response.data.data.product,
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  }
  handleAttributes(attribute, item) {
    this.manageAttributes(attribute, item);
  }
  addProductHandler() {
    if (this.state.attributes.length !== this.state.product.attributes.length) {
      this.setState({ showError: true });
      return setTimeout(() => this.setState({ showError: false }), 1000);
    }

    this.setState({ attributes: [], addedToCart: true });
    this.props.dispatch(
      cartActions.addProduct({
        ...this.state.product,
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

  inStockCheck() {
    return this.state.product.inStock ? (
      <button onClick={this.addProductHandler.bind(this)}>
        <>
          <p
            className={`${classes.addButtonText} ${
              this.state.addedToCart && classes.addedToCart
            }`}
          >
            Add To Cart
          </p>
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="lg"
            className={`${classes.icon} ${
              this.state.addedToCart && classes.addedToCart
            }`}
          />
        </>
      </button>
    ) : (
      <h2>Out Of Stock</h2>
    );
  }
  galleryLengthCheck() {
    return (
      this.state.product.gallery.length > 1 &&
      this.state.product.gallery.map((image, index) => {
        return (
          <img
            src={image}
            alt={index}
            className={index === this.state.current ? classes.selected : ""}
            key={index}
            onClick={() => this.setState({ current: index })}
          />
        );
      })
    );
  }
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    if (!this.state.product) {
      return <Error message="Product not found !" />;
    }
    const matchCurrency = this.state.product.prices.find(
      (price) => price.currency.label === this.props.currency.label
    );
    return (
      <div className={classes.container}>
        <div className={classes.leftColumn}>
          <div className={classes.imageGroup}>{this.galleryLengthCheck()}</div>

          <div className={classes.bigImage}>
            {this.state.product.gallery.map((image, index) => {
              return (
                <img
                  alt={index}
                  src={image}
                  className={`${classes.fade}
                    ${index === this.state.current ? "" : classes.hide}`}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        <div className={classes.rightColumn}>
          <div>
            <h1>{this.state.product.brand}</h1>
            <h1 className={classes.productNameText}>
              {this.state.product.name}
            </h1>
          </div>
          <AttributesButtons
            attributes={this.state.product.attributes}
            showError={this.state.showError}
            inStock={1}
            selectedAttributes={this.state.attributes}
            manageAttributes={this.handleAttributes}
          />
          <div className={classes.priceText}>
            <h4>PRICE:</h4>
            <h3>
              {matchCurrency.currency.symbol}
              {matchCurrency.amount}
            </h3>
          </div>
          <div className={classes.addButton}>{this.inStockCheck()}</div>
          <div className={classes.description}>
            {parse(this.state.product.description)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.currency,
});
export default connect(mapStateToProps)(Product);
