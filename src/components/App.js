import Sidebar from "./sidebar/Sidebar";

import React, { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <div className="container-fluid vh-100 vw-100 p-0">
        <div className="row vh-100 vw-100 m-0">
          <Sidebar />
        </div>
      </div>
    );
  }
}
