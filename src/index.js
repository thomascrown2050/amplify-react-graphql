import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import AddressDetails from './AddressDetails.js'
import BlockDetails from './BlockDetails.js'
import MyBlockmarks from './components.js/MyBlockmarks';
import Whales from './Whales.js'
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },

  {
    path: "block/:blockId",
    element: <BlockDetails />,
  },

  {
    path: "address/:addressId",
    element: <AddressDetails />,
  },

  {
    path: "/blockmarks",
    element: <MyBlockmarks />,
  },

  {
    path: "/whales",
    element: <Whales />,
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
