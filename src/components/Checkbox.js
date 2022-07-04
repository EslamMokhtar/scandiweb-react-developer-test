import React from "react";
import classes from "./Checkbox.module.css";
import { Component } from "react/cjs/react.production.min";

class Checkbox extends Component {
  handleOnChange(attName) {
    const position = "checkbox";
    let params = new URLSearchParams(this.props.location.search);

    if (!params.getAll(position).includes(attName)) {
      params.append(position, attName);
    } else {
      const save = params.getAll(position).find((item) => item !== attName);
      params.delete(position);
      save && params.append(position, save);
    }
    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: params.toString(),
    });

    this.props.handleChange(attName, position);
  }
  render() {
    return this.props.items.map((item, index) => {
      return (
        index % 2 === 0 && (
          <div className={classes.checkBox} key={index}>
            <div>
              <input
                checked={
                  this.props.checked
                    .map((e) => e.attName)
                    .indexOf(item.att.toLowerCase()) >= 0
                }
                id={item.att}
                type="checkbox"
                value={item.att}
                onChange={() => this.handleOnChange(item.att.toLowerCase())}
              />
              <label htmlFor={item.att}>
                <span></span>
                {item.att}
              </label>
            </div>
          </div>
        )
      );
    });
  }
}
export default Checkbox;
