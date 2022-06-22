import { Component } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import classes from "./Home.module.css";
import Card from "../components/Card";
import axios from "axios";
import Loader from "../shared/Loader";
import GET_CATEGORY from "../utils/graphql/queries/categoryQueries";
import Error from "../shared/Error";

class Category extends Component {
  constructor(props) {
    super(props);
    this.isMounted = false;
    this.state = {
      products: null,
      currentCategory: this.props.cid,
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
          this.setState({ products: response.data.data });
        }
      })
      .catch((err) => console.log(err));
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
  render() {
    if (!this.state.products) {
      return <Loader />;
    }
    if (!this.state.products.category) {
      return <Error message="Category not found !" />;
    }
    return (
      <>
        <center>
          <h1 className={classes.title}>{this.state.products.category.name}</h1>
        </center>
        {this.state.products.category.products.map((product) => {
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency.currency,
});
export default connect(mapStateToProps)(Category);
