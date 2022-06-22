import { Component } from "react/cjs/react.production.min";
import classes from "./MainNavbar.module.css";
import { connect } from "react-redux";
import { currencyActions } from "../store/currency-slice";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_CURRENCIES } from "../utils/graphql/queries/currencyQueries";
import {
  faShoppingBag,
  faShoppingCart,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

class MainNavbar extends Component {
  constructor(props) {
    super(props);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.chooseCurrency = this.chooseCurrency.bind(this);
    this.state = {
      dropdown: false,
      currncies: [],
      animate: false,
    };
  }
  chooseCurrency(item) {
    this.props.dispatch(currencyActions.changeCurrency(item));
    this.setState({ currency: item, dropdown: false });
  }
  toggleDropDown() {
    this.props.onCloseModal();
    this.setState((curState) => {
      return { dropdown: !curState.dropdown };
    });
  }
  componentDidMount() {
    axios({
      url: "http://localhost:4000",
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(GET_CURRENCIES),
    })
      .then((response) => {
        this.setState({ currncies: response.data.data.currencies });
      })
      .catch((err) => console.log(err));
  }
  componentDidUpdate(pre) {
    if (pre.items !== this.props.items) {
      this.setState({ animate: true });
      return setTimeout(() => this.setState({ animate: false }), 400);
    }
  }
  modalHandler() {
    this.setState({ dropdown: false });
    this.props.onClickModal();
  }
  closeCurrencyHandler() {
    this.setState({ dropdown: false });
  }
  linkItem(item, index) {
    return (
      <li key={index}>
        <NavLink
          to={`/${item}`}
          className={(isActive) =>
            isActive ? classes.activeLink : classes.linkItem
          }
        >
          {item}
        </NavLink>
      </li>
    );
  }
  currencyItem(item, index) {
    return (
      <li
        onClick={this.chooseCurrency.bind(this, item)}
        key={index}
        className={
          this.props.currency.label === item.label
            ? classes.selectedCurrency
            : ""
        }
      >
        <div className={classes.currencyDropdown}>
          <h3>{item.symbol}</h3>
          <h4>{item.label}</h4>
        </div>
      </li>
    );
  }
  totalQuantity(totalQuantity) {
    return (
      totalQuantity > 0 && (
        <span
          data-testid="totalQuantity"
          id="bagCounter"
          className={`${classes.badge} ${
            this.state.animate && classes.animate
          }`}
        >
          {totalQuantity}
        </span>
      )
    );
  }

  render() {
    const total = this.props.items.map((item) => {
      return item.quantity;
    });
    const reducerQuantity = (pre, curr) => pre + curr;
    const totalQuantity = total.reduce(reducerQuantity, 0);
    return (
      <header className={classes.header}>
        <nav>
          <ul className={classes.links}>
            {["all", "clothes", "tech"].map((item, index) =>
              this.linkItem(item, index)
            )}
          </ul>
          <Link to="/">
            <FontAwesomeIcon
              icon={faShoppingBag}
              size="2x"
              color="#5ece7b"
              className={classes.logo}
            />
          </Link>
          <div className={classes.navIcons}>
            <div onClick={this.toggleDropDown} className={classes.chevron}>
              <h3>{this.props.currency.symbol}</h3>
              <FontAwesomeIcon
                icon={this.state.dropdown ? faChevronUp : faChevronDown}
                size="xs"
              />
            </div>
            <div
              className={`${classes.modal} ${
                !this.state.dropdown && classes.close
              }`}
            >
              <div
                className={classes.overlayDrop}
                onClick={this.closeCurrencyHandler.bind(this)}
              />
              <ul
                className={`${classes.dropdownContent} ${
                  !this.state.dropdown && classes.close
                }`}
              >
                {this.state.currncies.map((item, index) =>
                  this.currencyItem(item, index)
                )}
              </ul>
            </div>
            <div
              className={classes.shopping}
              onClick={this.modalHandler.bind(this)}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {this.totalQuantity(totalQuantity)}
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.currency,
  items: state.cart.items,
});
export default connect(mapStateToProps)(MainNavbar);
