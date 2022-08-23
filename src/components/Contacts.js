import React, { Component } from "react";
import Contact from "./Contact";
import listContact from "../datas/Users.json"

export default class Contacts extends Component {
  render() {
    let newArray = Array(40);
    return (
      <ul className="p-0" style={{ listStyleType: "none" }}>
        <Contact name="Nao France" random="1" />
        {[...newArray].map((e, i) => (
          <Contact name={getRandomUser(true)} random={getRandomNumber()} id={i+1} key={i+2} />
        ))}
      </ul>
    );
  }
}

function getRandomNumber() {
  return Math.floor(Math.random() * 20);
}

function getRandomUser(genderOfName) {
  let randomUser = listContact[getRandomNumber()];
  return genderOfName === false ? randomUser.firstName : `${randomUser.firstName} ${randomUser.lastName}`; 
}