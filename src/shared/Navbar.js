import { Component } from "react/cjs/react.production.min";
import MainNavbar from "../components/MainNavbar";
import Modal from "../components/Modal";

class Navbar extends Component {
  constructor() {
    super();
    this.onClickModal = this.onClickModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.state = {
      modal: false,
    };
  }

  onClickModal() {
    this.setState((curState) => {
      return { modal: !curState.modal };
    });
  }
  onCloseModal() {
    this.setState({ modal: false });
  }
  render() {

    return (
      <>
        {this.state.modal && <Modal onClickModal={this.onClickModal} />}
        <MainNavbar
          onClickModal={this.onClickModal}
          onCloseModal={this.onCloseModal}
        />
      </>
    );
  }
}

export default Navbar;
