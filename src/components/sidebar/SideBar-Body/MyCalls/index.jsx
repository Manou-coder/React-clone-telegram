import { UserAuth } from '../../../../utils/context/AuthContext'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyCall from '../MyCall'

function MyCalls() {
  const { user } = UserAuth()
  const { myCalls } = useContext(SocketContactContext)

  console.log('myCalls', myCalls)

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {myCalls &&
        myCalls.map((e, i) => (
          <MyCall
            contactId={
              myCalls[i].from === user.uid ? myCalls[i].to : myCalls[i].from
            }
            isOutgoingCall={myCalls[i].from === user.uid}
            startTime={myCalls[i].startTime}
            videoCall={myCalls[i].videoCall}
            callId={myCalls[i].id}
            key={myCalls[i].id}
          />
        ))}
    </ul>
  )
}

export default MyCalls

// const myCallsList = [
//   {
//     from: 'kBmSu9b4EeVhdQC1fzZgXlK1ac02',
//     to: 'hJTBGfiYe9P458qvBF03gIhme7G3',
//     videoCall: true,
//     startTime: 1671613549568,
//     id: '1234',
//   },
//   {
//     from: 'hJTBGfiYe9P458qvBF03gIhme7G3',
//     to: 'kBmSu9b4EeVhdQC1fzZgXlK1ac02',
//     videoCall: false,
//     startTime: 1671613549568,
//     id: '1234',
//   },
//   {
//     from: 'hJTBGfiYe9P458qvBF03gIhme7G3',
//     to: 'kBmSu9b4EeVhdQC1fzZgXlK1ac02',
//     videoCall: true,
//     startTime: 1671999999999,
//     id: '1234',
//   },
// ]
