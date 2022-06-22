import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../store/index";
import Home from "../pages/Home";
import Navbar from "../shared/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

describe("Home Component", () => {
  test("render products if request succeeds", async () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <Home />
        </Router>
      </Provider>
    );
    const products = await screen.findAllByRole("link");
    expect(products).not.toHaveLength(0);
    unmount();
  });

  test("showing total quantity span when adding a product to bag", async () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <Navbar />
          <Home />
        </Router>
      </Provider>
    );
    const addButton = await screen.findByTestId("apple-airtag");
    fireEvent.click(addButton);
    const total = await screen.findByTestId("totalQuantity");
    expect(total).toBeInTheDocument();
    unmount();
  });
  test("total quantity increased when adding a product", async () => {
    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <Navbar />
          <Home />
        </Router>
      </Provider>
    );

    const addButton = await screen.findByTestId("apple-airtag");
    fireEvent.click(addButton);
    const total = await screen.findByTestId("totalQuantity");
    expect(total.textContent).toBe("2");
    unmount();
  });
});
