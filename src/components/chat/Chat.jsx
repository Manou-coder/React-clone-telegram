import React, { Component } from 'react'
import MessageBar from './Chat-Footer/MessageBar'
import MesssageBody from '../chat/Chat-Body/MessageBody'
import NavbarChat from './Chat-Header/NavbarChat'

export default class Chat extends Component {
  render() {
    return (
      <div className="col-12 col-lg-8 bg-light p-0 vh-100 d-flex flex-column _chat">
        <NavbarChat />
        <MesssageBody />
        <MessageBar />
      </div>
    )
  }
}
