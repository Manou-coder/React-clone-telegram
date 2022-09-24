import React, { useRef, useState } from 'react'
import { createUserInDB } from '../../../firebase-config'
import { UserAuth } from '../../../utils/context/AuthContext'

export default function SignUpModal() {
  const { signUp } = UserAuth()

  const [validation, setValidation] = useState('')

  const inputs = useRef([])
  const addInputs = (el) => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }
  const formRef = useRef()

  const handleForm = async (e) => {
    e.preventDefault()
    loadingForm = true

    if (
      (inputs.current[1].value.length || inputs.current[2].value.length) < 6
    ) {
      setValidation('6 characters min')
      return
    } else if (inputs.current[1].value !== inputs.current[2].value) {
      setValidation('Passwords do not match')
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
        setValidation('Email format invalid')
      }

      if (err.code === 'auth/email-already-in-use') {
        setValidation('Email already used')
      }
    }
  }

  let loadingForm = false

  return (
    <div className="modal-body">
      <form ref={formRef} onSubmit={handleForm} className="sign-up-form">
        <div className="mb-3">
          <label htmlFor="signUpEmail" className="form-label">
            Email adress
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
            Password
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
            Repeat Password
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

        <button className="btn btn-primary w-100">Submit</button>
        <div className="row justify-content-center">
          {loadingForm && (
            <div
              className="spinner-border text-primary mt-2"
              role="status"
            ></div>
          )}
        </div>
      </form>
    </div>
  )
}
