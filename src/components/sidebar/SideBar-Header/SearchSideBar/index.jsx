import color from '../../../../utils/style/color'

function SearchSideBar({ setBorderColor, inputLetters, setInputLetters }) {
  return (
    <input
      style={{
        border: 'none',
        outline: 'none',
        width: '200px',
        caretColor: color.primary,
      }}
      type="text"
      placeholder="Search"
      onChange={(e) => setInputLetters(e.target.value)}
      onFocus={() => {
        setBorderColor(true)
      }}
      onBlur={() => setBorderColor(false)}
    ></input>
  )
}

export default SearchSideBar
