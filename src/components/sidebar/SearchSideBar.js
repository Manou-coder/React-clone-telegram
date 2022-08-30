import color from '../../utils/style/color'

function SearchSideBar({ setBorderColor }) {
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
      onFocus={() => {
        setBorderColor(true)
      }}
      onBlur={() => setBorderColor(false)}
    ></input>
  )
}

export default SearchSideBar
