import React, { Component } from "react";

export default class MyMessage extends Component {
  render() {
    return (
      <div
        className="w-75 rounded float-end h-100 mb-3"
        style={{
          backgroundColor: "#d9ffb5",
          boxShadow: "1px 1px 1px gray",
        }}
      >
        <p className="p-2 mb-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
          impedit natus, eum saepe quam nesciunt dolore molestiae
          necessitatibus, numquam quidem nulla sunt at! Voluptatum, eveniet?
          Distinctio reiciendis velit est facilis? Ea voluptate ex, odit officia
          dolore hic recusandae rem vel tempore, veniam voluptas consequatur
          ullam quo voluptatem alias pariatur distinctio delectus et
          consequuntur mollitia! Earum expedita sit rerum optio deserunt.
        </p>
        <div
          className="triangle triangle-right type2"
          style={{
            color: "#d9ffb5",
            float: "right",
            position: "relative",
            right: "-20px",
          }}
        ></div>
      </div>
    );
  }
}
