import { Component } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import classes from "./Home.module.css";
import Card from "../components/Card";
import axios from "axios";
import Loader from "../shared/Loader";
import GET_CATEGORY from "../utils/graphql/queries/categoryQueries";
import Error from "../shared/Error";
import Checkbox from "../components/Checkbox";
import Select from "../components/Select";
import queryString from "query-string";
import ColorButton from "../shared/ColorButtons";

class Category extends Component {
  constructor(props) {
    super(props);
    this.isMounted = false;
    this.state = {
      currentCategory: this.props.cid,
      products: [],
      checkedState: [],
      originalArr: null,
      attributes: null,
    };
  }
  fetchData() {
    const cid = this.props.cid;

    axios({
      url: "http://localhost:4000",
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(GET_CATEGORY(cid)),
    })
      .then((response) => {
        if (this.isMounted) {
          const params = queryString.parse(this.props.location.search);
          const checkedState = [];
          for (const property in params) {
            const arr = params[property];
            const check = Array.isArray(arr);

            check
              ? arr.map((item) =>
                  checkedState.push({ attName: item, position: property })
                )
              : checkedState.push({
                  attName: params[property],
                  position: property,
                });
          }

          const attributes = {};
          response.data.data.category.products.map((product) => {
            product.attributes.map((item, index) => {
              const check =
                item.items.filter((e) => e.id === "Yes" || e.id === "No")
                  .length > 0;

              if (!attributes[check ? "yes" : item.name.toLowerCase()])
                attributes[check ? "yes" : item.name.toLowerCase()] = [];
              item.items.map((att) => {
                attributes[item.name.toLowerCase()]
                  ? !attributes[item.name.toLowerCase()]?.some(
                      (el) => att.id === el.att.id
                    ) && attributes[item.name.toLowerCase()].push({ att })
                  : attributes["yes"].push({ att: item.name });
              });
            });
          });

          this.setState({
            products:
              checkedState.length > 0
                ? this.filterProducts(
                    response.data.data.category.products,
                    checkedState
                  )
                : response.data.data.category.products,
            originalArr: response.data.data,
            attributes,
            checkedState,
          });
        }
      })
      .catch((err) => this.setState({ originalArr: {} }));
  }

  componentDidMount() {
    this.isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this.isMounted = false;
  }
  componentDidUpdate(pre) {
    if (pre.cid !== this.props.cid) {
      this.fetchData();
    }
  }

  filterProducts = (arr1, arr2) => {
    if (arr2.length === 0) {
      return this.state.originalArr.category.products;
    }
    const filterd = arr1.filter((item) => {
      const arrayOfChecks = item.attributes.map((attr) =>
        attr.items.some((r) => {
          let checkAtt = r.id.toLowerCase();
          if (r.value === "Yes" || r.value === "No") {
            checkAtt = attr.id.toLowerCase();
          }
          return arr2.map((e) => e.attName).indexOf(checkAtt) >= 0;
        })
      );
      return arrayOfChecks.includes(true);
    });
    return filterd;
  };

  handleChange(attName, position) {
    let findItem = this.state.checkedState.find((item) =>
      item.position === "checkbox"
        ? item.attName === attName
        : item.position === position
    );

    let updated;
    if (findItem) {
      if (position === "checkbox" || attName === "none") {
        updated = [...this.state.checkedState].filter((item) =>
          attName === "none"
            ? item.position !== position
            : item.attName !== attName
        );
      } else {
        findItem.attName = attName;
        updated = [...this.state.checkedState];
      }
    } else {
      attName !== "none"
        ? (updated = [...this.state.checkedState, { attName, position }])
        : (updated = [...this.state.checkedState]);
    }

    const updatedArr = this.filterProducts(
      this.state.originalArr.category.products,
      updated
    );
    this.setState({
      products: updatedArr,
      checkedState: updated,
    });
  }

  renderFilters() {
    const obj = this.state.attributes;
    let keys = Object.keys(obj);
    const newArr = [];
    keys.map((item, index) => {
      if (item === "yes" || item === "color") {
        newArr.push(item);
        keys.splice(index, 1);
      }
    });
    newArr.sort().reverse();
    keys = [...newArr, ...keys];

    return (
      <>
        {keys.map((key, index) => {
          if (key === "yes") {
            return (
              <Checkbox
                key={index}
                checked={this.state.checkedState}
                items={obj[key]}
                handleChange={this.handleChange.bind(this)}
                location={this.props.location}
                history={this.props.history}
              />
            );
          } else if (key === "color") {
            return (
              <ColorButton
                key={index}
                checked={this.state.checkedState}
                attributes={obj[key]}
                handleChange={this.handleChange.bind(this)}
                location={this.props.location}
                history={this.props.history}
              />
            );
          } else {
            const position = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <Select
                key={index}
                checked={this.state.checkedState}
                title={`Select ${key}`}
                position={`select${position}`}
                sizes={obj[key]}
                handleChange={this.handleChange.bind(this)}
                location={this.props.location}
                history={this.props.history}
              />
            );
          }
        })}
      </>
    );
  }

  render() {
    if (!this.state.originalArr) {
      return <Loader />;
    }
    if (!this.state.originalArr.category) {
      return <Error message="Category not found !" />;
    }
    return (
      <>
        <center>
          <h1 className={classes.title}>
            {this.state.originalArr.category.name}
          </h1>
        </center>
        <div className={classes.wrapper}>
          <div className={classes.left}>
            {this.state.attributes && this.renderFilters()}
          </div>
          <div className={classes.right}>
            {this.state.products.map((product) => {
              const matchCurrency = product.prices.find(
                (price) => price.currency.label === this.props.currency.label
              );
              return (
                <Card
                  key={product.id}
                  category={this.props.cid}
                  price={matchCurrency.amount}
                  symbol={matchCurrency.currency.symbol}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.currency,
});
export default connect(mapStateToProps)(Category);
