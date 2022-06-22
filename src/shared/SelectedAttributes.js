import { Component } from "react/cjs/react.production.min";

class SelectedAttributes extends Component {
  colorAttribute(attribute, classes) {
    const {
      colorButtonGroup,
      colorSelected,
      attributeName,
      attributeGroup,
    } = classes;
    return (
      <div
        key={attribute.id}
        className={this.props.showText ? attributeGroup : ""}
      >
        {this.props.showText && (
          <p className={attributeName}>{attribute.name}:</p>
        )}
        {attribute.items.map((item) => {
          return (
            <button
              style={{
                backgroundColor: item.value,
              }}
              className={`${colorButtonGroup} ${
                this.props.selectedAttributes.find(
                  (matchedAttribute) =>
                    matchedAttribute.value === item.displayValue
                ) && colorSelected
              }
                     
                    `}
              key={item.id}
            />
          );
        })}
      </div>
    );
  }
  sizeAttribute(attribute, classes) {
    const {
      attributeButton,
      selected,
      attributeName,
      attributeGroup,
    } = classes;
    return (
      <div
        key={attribute.id}
        className={this.props.showText ? attributeGroup : ""}
      >
        {this.props.showText && (
          <p className={attributeName}>{attribute.name}:</p>
        )}
        {attribute.items.map((item) => (
          <button
            key={item.id}
            className={`${attributeButton} ${
              this.props.selectedAttributes.find(
                (selectedAttribute) =>
                  selectedAttribute.value === item.displayValue &&
                  attribute.name === selectedAttribute.name
              )
                ? selected
                : ""
            }`}
          >
            {item.displayValue}
          </button>
        ))}
      </div>
    );
  }
  render() {
    return (
      this.props.selectedAttributes.length > 0 &&
      this.props.attributes.map((attribute) => {
        if (attribute.type === "swatch") {
          return this.colorAttribute(attribute, this.props.classes);
        }
        return this.sizeAttribute(attribute, this.props.classes);
      })
    );
  }
}

export default SelectedAttributes;
