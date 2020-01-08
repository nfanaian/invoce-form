# Invoice

A demo app

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to run the 
Invoice app.

Depencies of node_modules was excluded to save memory. Please install necessary dependencies. Go to the Invoice app directory and install/update dependencies:
```bash
npm install
```

While in the app directory, run the invoice app by executing the following 
command: 
```bash
npm start
```

This runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Approach


I took a very simplistic approach for this app, designing the invoice form around a few components. 

The app first loads the Invoice Form component which will load all the necessary invoice fields and maintain a dynamic list of line-items. It will first add one line item, and allow the user to add/remove line items as they please. If the user removes all line items, a new base line item will be added.

Package 'react-select' was leveraged in order to provide a list of items to select from as the user begins to type the name of the item. Likewise, same method was used for customer selection.

Total price is calculated as any changes are made to the form, only updating the state total price if the new total differs.

Upon submission, the form will be validated to ensure no missing fields, alerting the user of missing fields. If no fields are missing, the invoice will be posted to the backend, providing a success confirmation message once it has been confirmed that the databased has accepted the invoice.

