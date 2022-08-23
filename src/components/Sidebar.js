import React, { Component } from "react";
import EndOfSlidebar from "./EndOfSlidebar";
import Navbar from "./Navbar";
import SlideMenu from "./SlideMenu";

export default class Sidebar extends Component {
  render() {
    return (
      <div className="d-flex flex-column col-lg-4 p-0 sidebar vh-100 border-end border-secondary _sidebar">
        <Navbar />
        <SlideMenu />
        <EndOfSlidebar />
      </div>
    );
  }
}
