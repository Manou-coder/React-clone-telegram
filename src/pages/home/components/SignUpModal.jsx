import React, { useContext, useRef, useState } from 'react'
import { createUserInDB } from '../../../firebase-config'
import { UserAuth } from '../../../utils/context/AuthContext'
import { LanguageContext } from '../../../utils/context/LanguageContext'
import { ThemeContext } from '../../../utils/context/ThemeContext'

export default function SignUpModal() {
  const { signUp } = UserAuth()
  const { language } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)
  const [validation, setValidation] = useState('')
  const [loadingForm, setLoadingForm] = useState(false)
  const formRef = useRef()
  const inputs = useRef([])
  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const handleForm = async (e) => {
    e.preventDefault()
    setLoadingForm(true)

    if (
      (inputs.current[1].value.length || inputs.current[2].value.length) < 6
    ) {
      setValidation(_sixCharactersMin[language])
      setLoadingForm(false)
      return
    } else if (inputs.current[1].value !== inputs.current[2].value) {
      setValidation(_passwordsNotMatch[language])
      setLoadingForm(false)
      return
    }

    try {
      const cred = await signUp(
        inputs.current[0].value,
        inputs.current[1].value
      )
      setValidation('')
      console.log(cred, 'cred')
      createUserInDB(cred.user)
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setValidation(_invalidFormat[language])
        setLoadingForm(false)
      }

      if (err.code === 'auth/email-already-in-use') {
        setValidation(_alreadyUsed[language])
        setLoadingForm(false)
      }
    }
  }

  return (
    <div className="modal-body" onClick={() => setValidation('')}>
      <form ref={formRef} onSubmit={handleForm} className="sign-up-form">
        <div className="mb-3">
          <label htmlFor="signUpEmail" className="form-label">
            {_emailAdress[language]}
          </label>
          <input
            ref={addInputs}
            name="email"
            required
            type="email"
            className="form-control"
            id="signUpEmail"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="signUpPwd" className="form-label">
            {_password[language]}
          </label>
          <input
            ref={addInputs}
            name="pwd"
            required
            type="password"
            className="form-control"
            id="signUpPwd"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="repeatPwd" className="form-label">
            {_repeatPassword[language]}
          </label>
          <input
            ref={addInputs}
            name="pwd"
            required
            type="password"
            className="form-control"
            id="repeatPwd"
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

const _repeatPassword = {
  en: 'Repeat Password',
  fr: 'Répéter le mot de passe',
  il: 'חזור על הסיסמה',
}

const _submit = {
  en: 'Submit',
  fr: 'Envoyer',
  il: 'שלח',
}

const _invalidFormat = {
  en: 'Email format invalid!',
  fr: "Format d'e-mail invalide !",
  il: 'פורמט tאימייל לא חוקי!',
}

const _alreadyUsed = {
  en: 'Email already used!',
  fr: 'Adresse e-mail déjà utilisée!',
  il: 'כתובת דואר אלקטרוני כבר בשימוש!',
}

const _sixCharactersMin = {
  en: '6 characters min',
  fr: '6 caractères minimum !',
  il: 'מינימום 6 תווים',
}

const _passwordsNotMatch = {
  en: 'Passwords do not match',
  fr: 'Les mots de passe ne correspondent pas!',
  il: 'סיסמאות לא תואמות!',
}
