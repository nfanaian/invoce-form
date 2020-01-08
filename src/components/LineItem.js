import React from "react";
import Select from "react-select";
import _ from "lodash";

class LineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: null };
    this.onInputChange = this.onInputChange.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
  }

  /* Handle input change of non-component input */
  onInputChange = event => {
    this.props.onLineItemChange(this.props.id, {
      ...this.props.value,
      [event.target.name]: event.target.value
    });
  };

  /* Handle selection of items and autofill details and price accordingly */
  onItemChange = option => {
    this.setState({ selectedOption: option });
    this.props.onLineItemChange(this.props.id, {
      ...this.props.value,
      item: _.get(option, "item", ""), 
      details: _.get(option, ["item", "details"], ""), 
      price: _.get(option, ["item", "price"], "")
    });
  };

  /* Handle removal of item based on its component ID */
  removeLineItem = () => {
    this.setState({ selectedOption: null });
    this.props.removeLineItem(this.props.id);
  };

  render() {
    /* Generates a list of item options for the item selection input */
    const options = this.props.items.map(item => {
      return { value: item.item, label: item.item, item: item };
    });
    return (
      <div className="ui segment">
        <div className="field">
          <label>Item {this.props.id + 1}</label>
          <Select
            name="item"
            value={this.state.selectedOption}
            onChange={this.onItemChange}
            options={options}
            placeholder="Item"
            isClearable={true}
          />
        </div>
        <div className="field">
          <label>Details</label>
          <input
            type="text"
            name="details"
            value={this.props.value.details}
            onChange={this.onInputChange}
            placeholder="details"
          />
        </div>
        <div className="ui equal widthform">
          <div className="fields">
            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                max="99"
                value={this.props.value.quantity}
                onChange={this.onInputChange}
                placeholder="qty"
              />
            </div>
            <div className="field">
              <label>Price</label>
              <input
                type="number"
                name="price"
                min="0"
                max="9999999"
                value={this.props.value.price}
                onChange={this.onInputChange}
                placeholder="price"
              />
            </div>
          </div>
          <br />
          <div className="field">
            <button
              className="fluid ui button"
              type="button"
              name="remove"
              onClick={this.removeLineItem}
            >
              Remove Item
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LineItem;
