import { Component } from "react/cjs/react.production.min";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Navbar from "./shared/Navbar";
import Error from "./shared/Error";

class App extends Component {
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <Redirect to="all" />
          </Route>
          <Route
            path="/all"
            exact
            render={({ location, history }) => (
              <Home location={location} history={history} />
            )}
          />

          <Route path="/cart">
            <Cart />
          </Route>
          <Route
            path="/:cid/products/:pid"
            render={({ match }) => <Product pid={match.params.pid} />}
          />
          <Route
            exact
            path="/:cid"
            render={({ match, location, history }) => (
              <Category
                cid={match.params.cid}
                location={location}
                history={history}
              />
            )}
          />
          <Route path="*">
            <Error message="Page not found !!" />
          </Route>
        </Switch>
      </>
    );
  }
}

export default App;
