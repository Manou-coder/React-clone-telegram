import searchContact from '../../../../utils/functions/searchContact'
import getSearchedUser from '../../../../utils/functions/getSearchedUser'
import { UserAuth } from '../../../../utils/context/AuthContext'
import { useContext } from 'react'
import { SocketContactContext } from '../../../../utils/context/SocketContact'
import MyContact from '../MyContact'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'

function MyContacts({ inputLetters }) {
  const { user } = UserAuth()
  const { myContacts, allUsers } = useContext(SocketContactContext)
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)

  const myContactsObj = []
  for (const contactId of myContacts) {
    // console.log(contactId, 'contactId')
    const contactObj = allUsers.find((contact) => contact.userId === contactId)
    // console.log('contactObj', contactObj)
    if (contactObj) {
      myContactsObj.push(contactObj)
    }
  }

  // console.log('myContacts', myContacts)
  // console.log('myContactsObj', myContactsObj)

  const searchedContactList = searchContact(myContactsObj, inputLetters)
  // searchedContactList = searchedContactList.filter((e) => e.userId !== user.uid)

  const textColor = theme === 'light' ? 'black' : 'white'

  return (
    <ul className="p-0 mt-2" style={{ listStyleType: 'none' }}>
      {searchedContactList.length > 0 ? (
        searchedContactList.map((e, i) => (
          <MyContact
            contact={searchedContactList[i]}
            name1={getSearchedUser(searchedContactList, i, inputLetters)[0]}
            name2={getSearchedUser(searchedContactList, i, inputLetters)[1]}
            name3={getSearchedUser(searchedContactList, i, inputLetters)[2]}
            photoURL={searchedContactList[i].photoURL}
            description={searchedContactList[i].isTyping}
            id={searchedContactList[i].id}
            key={i + 2}
          />
        ))
      ) : (
        <div>
          <span>
            <h2 style={{ color: textColor }}>{_notChatsYet[language]}</h2>
          </span>
          <span>
            <p style={{ color: textColor }}>{_toAddContacts(language)}</p>
          </span>
        </div>
      )}
    </ul>
  )
}

export default MyContacts

const _notChatsYet = {
  en: 'You have not chats yet!',
  fr: "Vous n'avez pas encore de discussions!",
  il: "אין לך צ'אטים עדיין!",
}

const _notCallsYet = {
  en: 'You have not calls yet!',
  fr: "Vous n'avez pas encore d'appels!",
  il: 'אין לך שיחות עדיין!',
}

const IconBar = () => {
  const { theme } = useContext(ThemeContext)
  const textColor = theme === 'light' ? 'black' : 'white'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      style={{ height: '20px', fill: textColor }}
    >
      <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
    </svg>
  )
}

const _toAddContacts = (language) => {
  if (language === 'fr') {
    return (
      <p>
        {"Pour ajouter des contacts, appuyez sur l'icone "}
        {<IconBar />}
        {' en haut à gauche, puis sur '}
        {<strong>{'Contacts'}</strong>}
        {' et enfin appuyez sur le contact que vous voulez ajouter.'}
      </p>
    )
  } else if (language === 'il') {
    return (
      <p>
        {' כדי להוסיף אנשי קשר, לחץ על הסמל '}
        {<IconBar />}
        {' בצד שמאל למעלה, לאחר מכן על '}
        {<strong>{'אנשי קשר'}</strong>}
        {' ולבסוף לחץ על איש הקשר שברצונך להוסיף.'}
      </p>
    )
  } else {
    return (
      <p>
        {'To add contacts, press the '}
        {<IconBar />}
        {' icon at the top left, then '}
        {<strong>{'Contacts'}</strong>}
        {' and finally press the contact you want to add.'}
      </p>
    )
  }
}
