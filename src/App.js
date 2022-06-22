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
          <Route path="/all" exact>
            <Home />
          </Route>
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
            render={({ match }) => <Category cid={match.params.cid} />}
          />
          <Route path="*">
            <Error message="Page not found !!"/>
          </Route>
        </Switch>
      </>
    );
  }
}

export default App;
