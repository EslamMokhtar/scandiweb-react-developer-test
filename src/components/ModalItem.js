import { Component } from "react/cjs/react.production.min";
import { cartActions } from "../store/cart-slice";
import { connect } from "react-redux";
import classes from "./ModalItem.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectedAttributes from "../shared/SelectedAttributes";

class ModalItem extends Component {
  constructor() {
    super();
    this.state = { slide: "" };
  }
  handleAddQuantity(id, selectedAttributes) {
    this.setState({ slide: classes.slideUp });
    this.props.dispatch(
      cartActions.addQuantity({
        id: id,
        selectedAttributes: selectedAttributes,
      })
    );
    return setTimeout(() => this.setState({ slide: "" }), 500);
  }

  handleSubQuantity(id, selectedAttributes, quantity) {
    this.setState({ slide: classes.slideDown });
    this.props.dispatch(
      cartActions.subQuantity({
        id: id,
        selectedAttributes: selectedAttributes,
      })
    );
    if (quantity > 1) {
      return setTimeout(() => this.setState({ slide: "" }), 500);
    }
  }
  handleRemoveIcon(quantity) {
    return quantity > 1 ? (
      "-"
    ) : (
      <FontAwesomeIcon icon={faTrash} size="sm" className={classes.icon} />
    );
  }
  render() {
    const {
      id,
      brand,
      name,
      attributes,
      selectedAttributes,
      quantity,
      gallery,
    } = this.props.product;
    return (
      <div className={classes.cartItem}>
        <div className={classes.column}>
          <div className={classes.leftItems}>
            <div>
              <strong>{brand}</strong>
              <p>{name}</p>
            </div>

            <strong className={classes.priceText}>
              {this.props.symbol} {this.props.price.toFixed(2)}
            </strong>
            <SelectedAttributes
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              classes={classes}
              showText={true}
            />
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.addButtons}>
            <button
              onClick={this.handleAddQuantity.bind(
                this,
                id,
                selectedAttributes
              )}
            >
              +
            </button>
            <div className={classes.quantity}>
              <p className={this.state.slide}>{quantity}</p>
            </div>
            <button
              onClick={this.handleSubQuantity.bind(
                this,
                id,
                selectedAttributes,
                quantity
              )}
            >
              {this.handleRemoveIcon(quantity)}
            </button>
          </div>

          <img
            className={classes.profile}
            width="100%"
            src={gallery[0]}
            alt={name}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(ModalItem);
