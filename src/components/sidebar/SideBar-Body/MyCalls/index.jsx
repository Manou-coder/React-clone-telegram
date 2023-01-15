import { UserAuth } from '../../../../utils/context/AuthContext'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyCall from '../MyCall'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'

function MyCalls() {
  const { user } = UserAuth()
  const { myCalls } = useContext(SocketContactContext)
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)

  // console.log('myCalls', myCalls)
  const textColor = theme === 'light' ? 'black' : 'white'

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {myCalls && myCalls.length > 0 ? (
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
        ))
      ) : (
        <span>
          <h2 style={{ color: textColor }}>{_notCallsYet[language]}</h2>
        </span>
      )}
    </ul>
  )
}

export default MyCalls

const _notCallsYet = {
  en: 'You have not calls yet!',
  fr: "Vous n'avez pas encore d'appels!",
  il: 'אין לך שיחות עדיין!',
}

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
