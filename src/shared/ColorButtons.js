import { Component } from "react/cjs/react.production.min";
import classes from "./ColorButton.module.css";
import { Icon } from "@iconify/react";

class ColorButton extends Component {
  handleOnChange(item) {
    let params = new URLSearchParams(this.props.location.search);
    const attName = item.toLowerCase();
    const position = "selectColor";

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

    this.props.handleChange(attName, position);
  }
  colorAttribute(attribute) {
    return (
      <div className={classes.attributeUnit}>
        <h4 className={classes.attributeName}>Select color</h4>

        {[...attribute, { att: { id: "None" } }].map((item) => {
          if (item.att.id === "None") {
            return (
              <Icon
                className={classes.none}
                icon="bi:x-square-fill"
                key={item.att.id}
                onClick={this.handleOnChange.bind(this, item.att.id)}
              />
            );
          }
          return (
            <button
              style={{
                backgroundColor: item.att.value,
              }}
              className={`${classes.colorButtonGroup} ${
                this.props.checked.find(
                  (matchedAttribute) =>
                    matchedAttribute.attName === item.att.id.toLowerCase()
                ) && classes.colorSelected
              }
       
      `}
              onClick={this.handleOnChange.bind(this, item.att.id)}
              key={item.att.id}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return this.colorAttribute(this.props.attributes);
  }
}

export default ColorButton;
