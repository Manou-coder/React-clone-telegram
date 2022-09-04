import Contacts from '../Contacts'
import '../../../../utils/style/EndOfSlidebar.css'

function EndOfSlidebar({ inputLetters, setInputLetters }) {
  return (
    <div
      className="container-fluid bg-white"
      style={{
        height: 'calc(100vh)',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        width: '100%',
      }}
    >
      <div className="container-fluid p-0">
        <Contacts
          inputLetters={inputLetters}
          setInputLetters={setInputLetters}
        />
      </div>
    </div>
  )
}

export default EndOfSlidebar
