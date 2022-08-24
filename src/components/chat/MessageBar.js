import React, { Component } from "react";

export default class MessageBar extends Component {
  render() {
    // function autoResizeMessageBar() {
    //   let textarea = document.querySelector("#autoresizing");
    //   textarea.addEventListener("input", autoResize, false);

    //   function autoResize() {
    //     this.style.height = "auto";
    //     this.style.height = this.scrollHeight + "px";
    //     let barOfMesssage = textarea.parentElement.parentElement;
    //     if (this.scrollHeight > 30) {
    //       barOfMesssage.classNameList.remove("align-items-center");
    //       barOfMesssage.classNameList.add("align-items-baseline");
    //     } else {
    //       barOfMesssage.classNameList.remove("align-items-baseline");
    //       barOfMesssage.classNameList.add("align-items-center");
    //     }
    //   }
    // }

    // autoResizeMessageBar();
    return (
      <div className="row sticky-bottom py-1 bg-light w-100 m-0 p-0">
        <div className="col py-1 d-flex justify-content-center">
          <div className="row bg-white rounded-5 py-1 w-100 w-lg-75 align-items-center">
            <div className="col-1 d-flex justify-content-start">
              <span>
                <i className="fa-solid fa-face-smile fa-lg"></i>
              </span>
            </div>
            <div className="d-none d-lg-block col-1 d-flex justify-content-start">
              <span>
                <i className="fa-solid fa-paperclip fa-lg"></i>
              </span>
            </div>
            <div className="col">
              <textarea
                id="autoresizing"
                rows="1"
                placeholder="Messsage..."
                style={{
                  position: "relative",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  width: "100%",
                  bottom: "-2px",
                }}
              ></textarea>
            </div>
            <div className="col-1 d-flex justify-content-end">
              <span>
                <i className="fa-solid fa-paper-plane fa-lg"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
