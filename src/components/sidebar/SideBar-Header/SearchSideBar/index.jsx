import { useContext } from 'react'
import { LanguageContext } from '../../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../../utils/context/ThemeContext'
import color from '../../../../utils/style/color'

function SearchSideBar({
  setBorderColor,
  inputLetters,
  setInputLetters,
  inputSearchMessageRef,
}) {
  // DARK MODE
  const { theme } = useContext(ThemeContext)
  const bgColor = theme === 'light' ? 'white' : 'black'
  const textColor = theme === 'light' ? 'black' : 'White'

  // LANGUAGE
  const { language } = useContext(LanguageContext)

  const _search = {
    en: 'Search',
    fr: 'Rechercher',
    il: 'חפש',
  }

  return (
    <input
      ref={inputSearchMessageRef}
      style={{
        backgroundColor: bgColor,
        border: 'none',
        outline: 'none',
        width: '200px',
        caretColor: color.primary,
        color: textColor,
      }}
      type="text"
      placeholder={_search[language]}
      onChange={(e) => setInputLetters(e.target.value)}
      onFocus={() => {
        setBorderColor(true)
      }}
      onBlur={() => setBorderColor(false)}
    ></input>
  )
}

export default SearchSideBar
