import React from "react";
import { Icon } from "@iconify/react";
import classes from "./Select.module.css";
import { Component } from "react/cjs/react.production.min";

class Select extends Component {
  constructor(props) {
    super(props);
    this.handleClickChange = this.handleClickChange.bind(this);

    this.state = {
      open: false,
      select: this.props.title,
    };
  }
  componentDidMount() {
    const findItem = this.props.checked.find(
      (item) => item.position === this.props.position
    );

    if (findItem) {
      this.setState({ select: findItem.attName.toUpperCase() });
    }
  }

  handleClickChange() {
    this.setState((pre) => {
      return { open: !pre.open };
    });
  }
  handleSelectChange(item) {
    this.setState({
      open: false,
      select: item === "None" ? this.props.title : item.toUpperCase(),
    });

    let params = new URLSearchParams(this.props.location.search);
    const attName = item.toLowerCase();
    const position = this.props.position;

    if (params.has(position)) {
      attName === "none"
        ? params.delete(position)
        : params.set(position, attName);
    } else {
      attName !== "none" && params.append(position, attName);
    }

    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: params.toString(),
    });

    this.props.handleChange(attName, this.props.position);
  }
  render() {
    const sizes = this.props.sizes;

    return (
      <div
        className={`${classes.wrapper} ${this.state.open && classes.active}`}
      >
        <div onClick={this.handleClickChange} className={classes.selectBtn}>
          <span>{this.state.select}</span>
          <Icon className={classes.icon} icon="uil:angle-down" />
        </div>
        <div className={classes.content}>
          <ul className={classes.options}>
            {[{ att: { id: "None" } }, ...sizes].map((item, index) => {
              const check =
                this.props.checked
                  .map((e) => e.attName)
                  .indexOf(item.att.id.toLowerCase()) >= 0;

              return (
                <li
                  key={index}
                  className={
                    this.state.select === item.att.id || check
                      ? classes.selected
                      : ""
                  }
                  onClick={this.handleSelectChange.bind(this, item.att.id)}
                >
                  {item.att.id}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Select;
