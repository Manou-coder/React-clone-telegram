import React, { Component } from 'react'

export default class Contact extends Component {
  render() {
    return (
        <li className="w-100 py-1 my-2 rounded">
        <div className="row m-0 align-items-center">
          <div className="col-2">
            <img
              style={{
                height: "50px",
                width: "50px",
              }}
              src={`https://picsum.photos/50/50?random=${this.props.random}`}
              className="rounded-circle"
              alt="..."
            ></img>
          </div>
          <div className="col">
            <div>
              <h3 className="mb-0 fs-5 lh-1">{this.props.name}</h3>
            </div>
            <div>
              <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
            </div>
          </div>
          <div className="col-2 p-0">
            <span className="badge bg-primary rounded-pill">{this.props.random}</span>
          </div>
        </div>
      </li>
    )
  }
}
