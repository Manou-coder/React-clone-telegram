export default function SlideMenu({ isContactsOpen, setContactsOpen }) {

  const textColorContact = isContactsOpen ? 'text-primary' : ''
  const textColorCalls = isContactsOpen ? '' : 'text-primary'

  return (
    <div className="row text-center py-3 w-100 m-0 border-bottom">
      <div className="col">
        <button style={{ 'border': 'none', 'backgroundColor': 'transparent', }} className={`fw-bold cursor-pointer ${textColorContact}`} onClick={() => setContactsOpen(true)}>All chats</button>
        {isContactsOpen ? <div
          className="row bg-primary py-1 w-75 mt-1 rounded"
          style={{ margin: 'auto' }}
        ></div> : null}
      </div>
      <div className="col">
        <button style={{ 'border': 'none', 'backgroundColor': 'transparent', }} className={`fw-bold cursor-pointer ${textColorCalls}`} onClick={() => setContactsOpen(false)}>Calls</button>
        {!isContactsOpen ? <div
          className="row bg-primary py-1 w-75 mt-1 rounded"
          style={{ margin: 'auto' }}
        ></div> : null}
      </div>
    </div>
  )
}

