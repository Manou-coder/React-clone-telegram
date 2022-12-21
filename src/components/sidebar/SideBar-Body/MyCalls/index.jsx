// export default function MyCalls() {
//   return (
//     <ul className="p-0" style={{ listStyleType: 'none' }}>
//       <li>salut</li>
//     </ul>
//   )
// }

import { UserAuth } from '../../../../utils/context/AuthContext'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyContact from '../MyContact'
import MyCall from '../MyCall'

function MyCalls({ inputLetters }) {
  const { user } = UserAuth()
  const { myContacts, allUsers } = useContext(SocketContactContext)

  //   const myCallsList = []

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {myCallsList.map((e, i) => (
        <MyCall
          contactId={
            myCallsList[i].from === user.uid
              ? myCallsList[i].to
              : myCallsList[i].from
          }
          isOutgoingCall={myCallsList[i].from === user.uid}
          startTime={myCallsList[i].startTime}
          videoCall={myCallsList[i].videoCall}
          id={myCallsList[i].id}
          key={myCallsList[i].id}
        />
      ))}
    </ul>
  )
}

export default MyCalls

const myCallsList = [
  {
    from: 'kBmSu9b4EeVhdQC1fzZgXlK1ac02',
    to: 'hJTBGfiYe9P458qvBF03gIhme7G3',
    videoCall: true,
    startTime: 1671613549568,
    id: '1234',
  },
  {
    from: 'hJTBGfiYe9P458qvBF03gIhme7G3',
    to: 'kBmSu9b4EeVhdQC1fzZgXlK1ac02',
    videoCall: false,
    startTime: 1671613549568,
    id: '1234',
  },
]
