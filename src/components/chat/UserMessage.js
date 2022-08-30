import React, { Component } from 'react'

export default class UserMessage extends Component {
  render() {
    return (
      <div
        className="bg-white w-75 rounded float-start h-100 mb-3"
        style={{
          WebkitBoxShadow: '5px 5px 15px 5px #000000',
          boxShadow: '1px 1px 1px gray',
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
          className="triangle triangle-left type3 text-white"
          style={{
            color: '#d9ffb5',
            float: 'left',
            position: 'relative',
            left: '-20px',
          }}
        ></div>
      </div>
    )
  }
}
