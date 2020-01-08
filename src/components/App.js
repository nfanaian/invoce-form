import React from "react";
import fattmerchant from "../api/fattmerchant";
import InvoiceForm from "./InvoiceForm";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import _ from "lodash";

class App extends React.Component {
  state = {
    items: [],
    customers: [],
    showSuccess: false,
    showError: false,
    missingItems: [],
    reset: false
  };

  componentDidMount() {
    this.loadItems();
  }

  /* Initial GET for items and customers */
  loadItems = term => {
    fattmerchant
      .get("/item")
      .then(response => {
        this.setState({
          items: response.data.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  /* On Form Submit, if form is valid, POST invoice */
  onSubmit = data => {
    if (this.validateForm(data)) {
      this.postInvoice(data);
    }
  };

  resetMessages = () => {
    this.setState({
      ...this.state,
      showError: false,
      showSuccess: false,
      missingItems: []
    });
    return [];
  };

  /* Validate all fields are included */
  validateForm = data => {
    this.resetMessages();
    var newMissingItems = []

    /* Iterate through line items and check required fields */
    for (var i = 0; i < data.lineItems.length; i++) {
      if (_.get(data, ["lineItems", i, "item"], null) == null) {
        newMissingItems.push(`Missing Item on Item # ${i+1}`);
      }

      if (_.get(data, ["lineItems", i, "price"], null) == null) {
        newMissingItems.push(`Missing Price on Item # ${i+1}`);
      }

      if (_.get(data, ["lineItems", i, "quantity"], null) == null) {
        newMissingItems.push(`Missing Quantity on Item # ${i+1}`);
      }

      if (_.get(data, ["customer", "value"], null) == null) {
        newMissingItems.push(`Missing Customer on Item # ${i+1}`);
      }

      if (_.get(data, ["memo"], null) == null) {
        newMissingItems.push(`Missing Memo on Item # ${i+1}`);
      }
    }

    /* Show Error is item missing and invalidate form */
    if (newMissingItems.length > 0) {
      this.setState({
        showError: true,
        missingItems: newMissingItems
      });
      return false;
    }
    return true;
  };

  /* Post Invoice to backend */
  postInvoice = data => {
    this.resetMessages();
    var allLineItems = [];

    for (var i = 0; i < data.lineItems.length; i++) {
      var newLineItem = {
        id: data.lineItems[i].item.id,
        item: data.lineItems[i].item.item,
        details: data.lineItems[i].details,
        quantity: Number(data.lineItems[i].quantity),
        price: Number(data.lineItems[i].price)
      };
      allLineItems.push(newLineItem);
    }
    var invoice = {
      customer_id: data.customer.value,
      url: "https://omni.fattmerchant.com/#/bill/",
      meta: {
        lineItems: allLineItems,
        subtotal: Number(data.totalPrice),
        tax: 0,
        memo: data.memo
      },
      total: data.totalPrice.toString()
    };

    console.log("Invoice: ");
    console.log(invoice);

    fattmerchant
      .post("/invoice", invoice)
      .then(response => {
        this.setState({ showSuccess: true, showError: false });
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="ui container">
        <h2>Invoice</h2>
        {this.state.showSuccess && <SuccessMessage />}
        {this.state.showError && <ErrorMessage missingItems={this.state.missingItems} />}
        <InvoiceForm
          items={this.state.items}
          onSubmit={this.onSubmit}
          onSuccess={this.state.showSuccess}
          onReset={this.resetMessages}
        />
      </div>
    );
  }
}

export default App;
