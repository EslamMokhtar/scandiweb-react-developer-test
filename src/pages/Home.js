import { Component } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import classes from "./Home.module.css";
import Card from "../components/Card";
import axios from "axios";
import Loader from "../shared/Loader";
import { GET_PRODUCTS } from "../utils/graphql/queries/productQueries";

class Items extends Component {
  constructor() {
    super();
    this.state = {
      products: null,
    };
  }

  componentDidMount() {
    axios({
      url: "http://localhost:4000",
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(GET_PRODUCTS),
    })
      .then((response) => {
        this.setState({ products: response.data.data });
      })
      .catch((err) => console.log(err));
  }
  render() {
    if (!this.state.products) {
      return <Loader />;
    }
    return (
      <>
        <center>
          <h1 className={classes.title}>
            {this.state.products.categories[0].name}
          </h1>
        </center>
        {this.state.products.categories[0].products.map((product) => {
          const matchCurrency = product.prices.find(
            (price) => price.currency.label === this.props.currency.label
          );

          return (
            <Card
              key={product.id}
              category="all"
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
export default connect(mapStateToProps)(Items);
