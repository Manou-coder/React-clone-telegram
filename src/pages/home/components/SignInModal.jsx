import React, { useContext, useRef, useState } from 'react'
import { UserAuth } from '../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../utils/context/ThemeContext'
import '../Home.css'

export default function SignInModal() {
  const navigate = useNavigate()
  const { signIn } = UserAuth()
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)
  const [validation, setValidation] = useState('')
  const [loadingForm, setLoadingForm] = useState(false)
  const inputs = useRef([])
  const formRef = useRef()
  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const handleForm = async (e) => {
    e.preventDefault()
    console.log(inputs)
    setLoadingForm(true)
    try {
      const cred = await signIn(
        inputs.current[0].value,
        inputs.current[1].value
      )
      setValidation('')
      console.log('cred', cred)
      navigate(`/chat`)
    } catch {
      setValidation(_incorrectEmail[language])
      setLoadingForm(false)
    }
  }

  const bgColor2 = theme === 'light' ? 'bg-white' : 'bg-black'
  const textColor = theme === 'light' ? 'text-dark' : 'text-light'

  return (
    <div className="modal-body" onClick={() => setValidation('')}>
      <form ref={formRef} onSubmit={handleForm} className="sign-up-form">
        <div className="mb-3">
          <label htmlFor="signInEmail" className="form-label">
            {_emailAdress[language]}
          </label>
          <input
            ref={addInputs}
            name="email"
            required
            type="email"
            className={`form-control ${bgColor2} ${textColor}`}
            id="signInEmail"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="signInPwd" className="form-label">
            {_password[language]}
          </label>
          <input
            ref={addInputs}
            name="pwd"
            required
            type="password"
            className={`form-control ${bgColor2} ${textColor}`}
            id="signInPwd"
          />
          <p className="text-danger mt-1">{validation}</p>
        </div>

        <button className="btn btn-primary w-100">{_submit[language]}</button>
        <div className="row justify-content-center mt-2">
          {loadingForm && (
            <div className="spinner-border text-primary" role="status"></div>
          )}
        </div>
      </form>
    </div>
  )
}

const _emailAdress = {
  en: 'Email Adress',
  fr: 'Adresse e-mail',
  il: 'כתובת דוא"ל',
}

const _password = {
  en: 'Password',
  fr: 'Mot de passe',
  il: 'סיסמה',
}

const _submit = {
  en: 'Submit',
  fr: 'Envoyer',
  il: 'שלח',
}

const _incorrectEmail = {
  en: 'Incorrect email and / or password!',
  fr: 'E-mail et / ou mot de passe incorrect!',
  il: 'אימייל ו/או סיסמה שגויים!',
}

const _tryAgain = {
  en: 'Try Again',
  fr: 'Envoyer',
  il: 'שלח',
}
