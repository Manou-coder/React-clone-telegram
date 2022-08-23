import React, { Component } from 'react'
import Contacts from './Contacts'
import '../styles/EndOfSlidebar.css'

export default class EndOfSlidebar extends Component {
  render() {
    return (
        <div
        className="container-fluid bg-light"
        style={{
          height: "calc(100vh)",
          overflowY: "scroll",
          scrollbarWidth: "none",
          width: "100%",
        }}
      >
        <div className="container-fluid p-0">
            <Contacts />
        </div>
      </div>
    )
  }
}
