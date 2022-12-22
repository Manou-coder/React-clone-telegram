import { format, formatRelative } from 'date-fns'
import { enUS, fr, he } from 'date-fns/locale'

export const localeLanguage = (language) => {
  if (language === 'il') {
    return he
  } else if (language === 'fr') {
    return fr
  } else {
    return enUS
  }
}

export const _at = {
  en: 'at',
  fr: 'à',
  il: 'ב',
}

export const calculDate = (startTime, language) => {
  const relativeFormatDate = formatRelative(new Date(startTime), new Date(), {
    locale: localeLanguage(language),
  })
  // console.log('relativeFormatDate', relativeFormatDate)
  if (!relativeFormatDate.includes('/')) {
    return relativeFormatDate
  } else {
    const normalFormatDate = format(
      new Date(startTime),
      `eeee d LLLL ${_at[language]} HH:mm`,
      {
        locale: localeLanguage(language),
      }
    )
    return normalFormatDate
  }
}
