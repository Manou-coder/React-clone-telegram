import React, { Component } from 'react'
import MyMessage from '../MyMessage'
import TimeBadge from '../TimeBadge/index.jsx'
import UserMessage from '../UserMessage'

export default class MesssageBody extends Component {
  render() {
    let newArray = Array(50)
    return (
      <div
        className="col h-100"
        style={{
          backgroundImage: 'url(/img/chat-wallpaper.jpg)',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          width: '100%',
        }}
      >
        <div className="container" style={{ width: '90%' }}>
          {/* <!-- this div is meant to put a space between the message bubbles and the nav bar --> */}
          <div
            className="w-100 float-start"
            style={{ padding: '12px 0px' }}
          ></div>
          {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}

          <div>
            {[...newArray].map((e, i) => (
              <div key={`Message-${i}}`}>
                <UserMessage />
                <TimeBadge />
                <MyMessage />
              </div>
            ))}

            {/* ------------------------------------MESSAGES-HERE------------------------------------------- */}
            {/* <!-- this div is meant to put a space between the message bubbles and the message bar --> */}
            <div
              className="w-100 float-start"
              style={{ padding: '1px 0px' }}
            ></div>
          </div>
        </div>
      </div>
    )
  }
}
