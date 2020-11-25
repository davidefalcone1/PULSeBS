import React from "react";
import ReactDOM from "react-dom";
import App from "../src/App";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-dom", () => ({ render: jest.fn() }));

describe("Application", () => {
  it("Render the app without crashing", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    require("../src/index.js");
    expect(ReactDOM.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>,
      div
    );
  });
})  