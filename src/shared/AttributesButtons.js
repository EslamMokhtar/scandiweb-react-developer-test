import { Component } from "react/cjs/react.production.min";
import classes from "./AttributesButtons.module.css";

class AttributesButtons extends Component {
  handleAttributeClick(attribute, item) {
    this.props.manageAttributes(attribute, item);
  }
  colorAttribute(attribute, error) {
    return (
      <div key={attribute.id} className={classes.attributeUnit}>
        <h4 className={classes.attributeName}>{attribute.name}:</h4>
        <div className={error ? classes.error : ""}>
          {attribute.items.map((item) => {
            return (
              <button
                style={{
                  backgroundColor: error ? "red" : item.value,
                }}
                className={`${classes.colorButtonGroup} ${
                  this.props.selectedAttributes.find(
                    (matchedAttribute) =>
                      matchedAttribute.value === item.displayValue &&
                      matchedAttribute.name === attribute.name
                  ) && classes.colorSelected
                }
       
      `}
                onClick={this.handleAttributeClick.bind(this, attribute, item)}
                key={item.id}
              />
            );
          })}
        </div>
      </div>
    );
  }
  sizeAttribute(attribute, error) {
    return (
      <div key={attribute.id} className={classes.attributeUnit}>
        <h4 className={classes.attributeName}>{attribute.name}:</h4>
        <div className={error ? classes.error : ""}>
          {attribute.items.map((item) => {
            return (
              <button
                className={`${classes.buttonGroup} ${
                  this.props.selectedAttributes.find(
                    (matchedAttribute) =>
                      matchedAttribute.value === item.displayValue &&
                      matchedAttribute.name === attribute.name
                  ) && classes.selected
                }
         
        `}
                onClick={this.handleAttributeClick.bind(this, attribute, item)}
                key={item.id}
              >
                {item.displayValue}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  render() {
    return (
      this.props.attributes.length > 0 &&
      this.props.inStock &&
      this.props.attributes.map((attribute) => {
        if (attribute.type === "swatch") {
          const error =
            !this.props.selectedAttributes.find(
              (matchedAttribute) => matchedAttribute.name === attribute.name
            ) && this.props.showError;
          return this.colorAttribute(attribute, error);
        }
        const error =
          !this.props.selectedAttributes.find(
            (matchedAttribute) => matchedAttribute.name === attribute.name
          ) && this.props.showError;
        return this.sizeAttribute(attribute, error);
      })
    );
  }
}

export default AttributesButtons;
