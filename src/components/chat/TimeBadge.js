import React, { Component } from 'react'

export default class TimeBadge extends Component {
  render() {
    return (
      <div className='row w-100 justify-content-center mb-3'>
        <div className='col-2 py-1 bg-white rounded text-center opacity-75'>
            <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    )
  }
}
