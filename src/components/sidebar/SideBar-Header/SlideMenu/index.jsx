import React, { Component } from 'react'

export default class SlideMenu extends Component {
  render() {
    return (
      <div className="row text-center py-3 w-100">
        <div className="col">
          <span className="fw-bold text-primary">All chats</span>
          <div
            className="row bg-primary py-1 w-75 mt-1 rounded"
            style={{ margin: 'auto' }}
          ></div>
        </div>
        <div className="col">
          <span className="fw-bold">Calls</span>
        </div>
      </div>
    )
  }
}
