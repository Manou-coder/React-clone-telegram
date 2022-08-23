import React, { Component } from 'react'

export default class Navbar extends Component {
  render() {
    return (
        <div className="row w-100 align-items-center sticky-top m-0 bg-white" style={{height: "58px"}}>
        <div className="col-2 d-flex justify-content-center ">
            <span><i className="fa-solid fa-bars fa-lg"></i></span>
        </div>
        <div className="col d-flex justify-content-center">
            <div className="row w-100 bg-white border border-secondary rounded-5 my-2 py-2 align-items-center">
                <div className="col-1">
                    <span><i className="fa-solid fa-magnifying-glass fa-lg"></i></span>
                </div>
                <div className="col">
                    <input style={{border:'none', outline: 'none', width: '200px'}} type="text"
                        placeholder="Search"></input>
                </div>
            </div>
        </div>
    </div>
    )
  }
}
