import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/lib/Async";
import fattmerchant from "../api/fattmerchant";
import LineItem from "./LineItem";

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memo: "",
      customer: "",
      lineItems: [],
      totalPrice: 0
    };
    this.onLineItemChange = this.onLineItemChange.bind(this);
  }

  /* Add initial line item */
  componentDidMount() {
    this.addLineItem();
  }

  /* Attempt to submit form */
  onFormSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  /* Handle input change of non-component input */
  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /* Handle updates to line item */
  onLineItemChange = (itemIndex, newLineItem) => {
    var updatedLineItems = this.state.lineItems.map(lineItem =>
      lineItem.itemIndex === itemIndex ? newLineItem : lineItem
    );

    this.setState({ lineItems: updatedLineItems });

    this.updateTotal(updatedLineItems);
  };

  /* Add line item to form */
  addLineItem = () => {
    var lineItem = {
      itemIndex: this.state.lineItems.length,
      item: null,
      details: "",
      quantity: "",
      price: ""
    };
    var newLineItems = [...this.state.lineItems, lineItem];
    this.setState({ lineItems: newLineItems });
  };

  /* Remove line item based on item index,
         ensuring there is at least one line item available */
  removeLineItem = itemIndex => {
    var newLineItems = this.state.lineItems.filter(
      lineItem => lineItem.itemIndex !== itemIndex
    );

    /* reset line item indexes */
    for (var i = 0; i < newLineItems.length; i++) {
      newLineItems[i] = { ...newLineItems[i], itemIndex: i };
    }

    if (newLineItems.length < 1) {
      newLineItems = [
        {
          itemIndex: 0,
          item: null,
          details: "",
          quantity: "",
          price: ""
        }
      ];
    }
    this.setState({ lineItems: newLineItems });
    this.updateTotal(newLineItems);
  };

  /* Reset Form after submission */
  resetForm = () => {
    this.setState({
      memo: "",
      customer: "",
      lineItems: [],
      totalPrice: 0
    });
    this.state.lineItems.forEach((lineItem, index) => {
      this.removeLineItem(index);
    });
    this.props.onReset();
  };

  /* Update total price if total price has changed */
  updateTotal = lineItems => {
    var total = 0;
    lineItems.forEach(lineItem => {
      total += lineItem.price * lineItem.quantity;
    });

    if (total !== this.state.totalPrice) {
      this.setState({ totalPrice: total });
    }
  };

  /* Handle selection of customer */
  onCustomerChange = value => {
    this.setState({ customer: value });
  };

  loadCustomerOptions = (inputValue, callback) => {
    fattmerchant.get("/customer/?keywords[]=" + inputValue).then(response => {
      let options = response.data.data.map(customer => {
        return {
          value: customer.id,
          label: customer.firstname + " " + customer.lastname
        };
      });
      callback(options);
    });
  };

  render() {
    /* Dynamically generates list of line items */
    const lineItems = this.state.lineItems.map(lineItem => {
      return (
        <LineItem
          key={lineItem.itemIndex}
          id={lineItem.itemIndex}
          value={this.state.lineItems[lineItem.itemIndex]}
          onLineItemChange={this.onLineItemChange}
          removeLineItem={this.removeLineItem}
          items={this.props.items}
        />
      );
    });

    return (
      <div className="ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <div>{lineItems}</div>
          <div className="ui segment">
            <div className="field">
              <button
                className="fluid ui button"
                type="button"
                value="Add Line Item"
                onClick={this.addLineItem}
              >
                Add New Item
              </button>
            </div>
          </div>
          <div className="ui segment">
            <div className="field">
              <label>Memo</label>
              <input
                type="text"
                name="memo"
                placeholder="Memo"
                value={this.state.memo}
                onChange={this.onInputChange}
              />
            </div>
            <div className="field">
              <label>Customer</label>
              <AsyncSelect
                name="customer"
                value={this.state.customer}
                onChange={this.onCustomerChange}
                loadOptions={this.loadCustomerOptions}
                placeholder="Customer Name"
                cacheOptions
                defaultOptions
              />
            </div>
            <div className="field">
              <label>
                Total: <span>{this.state.totalPrice}</span>
              </label>
            </div>
            {!this.props.onSuccess && (
              <button className="fluid ui button" type="submit" name="submit">
                Submit Invoice
              </button>
            )}
            {this.props.onSuccess && (
              <button
                className="fluid ui button"
                type="button"
                name="reset"
                onClick={this.resetForm}
              >
                Reset Invoice
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default InvoiceForm;
