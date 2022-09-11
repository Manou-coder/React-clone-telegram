export default function Message({ messageDisplay, myMessage }) {

  const justifyContentMsg = myMessage ? 'end' : 'start'
  const bgColorMsg = myMessage ? '#d9ffb5' : 'white'


  return (
    <div className={`w-100 d-flex justify-content-${justifyContentMsg} mb-1`}>
      <div className="rounded" style={{ backgroundColor: bgColorMsg, boxShadow: ' 1px 1px 1px gray' }}>
        <p className="p-2 mb-0 text-start">{messageDisplay}</p>
      </div>
    </div>
  );
}
