import React, { Component } from "react";

export default class MessageBar extends Component {
  render() {
    let objFunc = {
      scrollHeight: 0,
      func1: function autoResize(e) {
        let event = e.target;
        event.style.height = "auto";
        event.style.height = event.scrollHeight + "px";
        this.scrollHeight = event.scrollHeight;
        // console.log(objFunc.scrollHeight);
        return event.scrollHeight;
      },
      func2: function autoResizeClassName(event) {
        console.log(objFunc.scrollHeight);
        let classNameOfMessageInput =
          "row bg-white rounded-5 py-1 w-100 w-lg-75 align-items-center";
        if (this.scrollHeight > 30) {
          classNameOfMessageInput = classNameOfMessageInput.replace(
            "align-items-center",
            "align-items-baseline"
          );
        } else {
          classNameOfMessageInput = classNameOfMessageInput.replace(
            "align-items-baseline",
            "align-items-center"
          );
        }
        return classNameOfMessageInput;
      },
      func3: function () {
        return 3;
      }
    };

    // console.log(objFunc.func2());

    // console.log(objFunc.scrollHeight);

    return (
      <div className="row sticky-bottom py-1 bg-light w-100 m-0 p-0">
        <div className="col py-1 d-flex justify-content-center">
          <div className={objFunc.func2()}>
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
                // eslint-disable-next-line no-restricted-globals
                onInput={() => objFunc.func1(event)}
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
