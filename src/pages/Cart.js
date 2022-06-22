import { Component } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import classes from "./Cart.module.css";
import CartItem from "../components/CartItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      dropdown: false,
    };
  }

  toggleDropDown() {
    console.log("clicked");
    this.setState((curState) => {
      return { dropdown: !curState.dropdown };
    });
  }
  emptyCart() {
    return (
      <div className={classes.empty}>
        <lottie-player
          src="https://assets4.lottiefiles.com/packages/lf20_GlZGOi.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px" }}
          autoplay
        />
        <h1>Your cart is empty!</h1>
      </div>
    );
  }

  calculateTotal() {
    const total = this.props.items.map((item) => {
      const quantity = item.quantity;
      const foundedAmount = item.prices.find(
        (price) => price.currency.label === this.props.currency.label
      );
      return quantity * foundedAmount.amount;
    });
    const reducerTotal = (pre, curr) => pre + curr;
    const totalAmount = total.reduce(reducerTotal, 0);
    return totalAmount;
  }
  renderTable(rows) {
    return (
      <table>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                <td>{row.firstCol}: </td>
                <td className={classes.secCol}>{row.secCol}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    if (this.props.items.length === 0) {
      return this.emptyCart();
    }
    const total = this.props.items.map((item) => {
      return item.quantity;
    });
    const reducerQuantity = (pre, curr) => pre + curr;
    const totalQuantity = total.reduce(reducerQuantity, 0);
    const items = [...this.props.items].reverse();
    const totalAmount = this.calculateTotal();
    const rows = [
      {
        firstCol: "Tax 21%",
        secCol: this.props.currency.symbol + (totalAmount * 0.21).toFixed(2),
      },
      {
        firstCol: "Quantity",
        secCol: totalQuantity,
      },
      {
        firstCol: "Total",
        secCol: this.props.currency.symbol + totalAmount.toFixed(2),
      },
    ];
    return (
      <div className={classes.container}>
        <h1 className={classes.title}>CART</h1>
        <div className={classes.cards}>
          {items.map((item, index) => {
            const matchCurrency = item.prices.find(
              (price) => price.currency.label === this.props.currency.label
            );

            return (
              <CartItem
                key={index}
                symbol={matchCurrency.currency.symbol}
                price={matchCurrency.amount}
                product={item}
              />
            );
          })}
        </div>

        <div
          className={classes.footer}
          onMouseLeave={() => this.setState({ dropdown: false })}
        >
          <div onClick={this.toggleDropDown} className={classes.chevron}>
            <FontAwesomeIcon
              icon={this.state.dropdown ? faChevronDown : faChevronUp}
              size="lg"
            />
          </div>

          <div
            onClick={this.toggleDropDown}
            className={`${classes.total} ${
              this.state.dropdown && classes.totalUp
            }`}
          >
            {this.renderTable(rows)}
          </div>

          <div className={classes.button}>
            <button>Order</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.cart.items,
  total: state.cart.total,
  currency: state.currency.currency,
});
export default connect(mapStateToProps)(Cart);
