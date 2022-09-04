import React, { Component } from "react";

export default class NavbarChat extends Component {
  render() {

    function showSidebar () {
        let chat = document.querySelector('._chat')
        let sidebar = document.querySelector('._sidebar')
        chat.className = 'd-none';
        sidebar.className = 'd-flex flex-column';
        sidebar.style.padding = '0px';
    }

    return (
      <div className="row w-100 sticky-top bg-light align-items-center m-0">
        <div className="col-1 d-lg-none">
          <span onClick={() => showSidebar()} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-arrow-left fa-lg"></i>
          </span>
        </div>
        <div className="col-2 col-lg-1 py-1">
          <img
            style={{ height: "50px", width: "50px" }}
            src="https://picsum.photos/50/50?random=1"
            className="rounded-circle"
            alt="..."
          ></img>
        </div>
        <div className="col">
          <div>
            <h3 className="mb-0 fs-5 lh-1">Nao France</h3>
          </div>
          <div>
            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
          </div>
        </div>
        <div className="d-none d-lg-flex col-lg-1">
          <span>
            <i className="fa-solid fa-phone fa-lg"></i>
          </span>
        </div>
        <div className="d-none d-lg-flex col-lg-1">
        <span>
            <i className="fa-solid fa-magnifying-glass fa-lg"></i>
        </span>
        </div>
        <div className="col-1">
        <span>
            <i className="fa-solid fa-ellipsis-vertical fa-lg"></i>
        </span>
        </div>
      </div>
    );
  }
}


