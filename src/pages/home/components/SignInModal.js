import React, { useRef, useState } from 'react'
import { UserAuth } from '../../../utils/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignUpModal() {
  const { signIn } = UserAuth()

  const navigate = useNavigate()

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
      setValidation('Wopsy, email and/or password incorrect')
    }
  }

  //loading states
  const [loadingForm, setLoadingForm] = useState(false)

  return (
    <div className="modal-body">
      <form ref={formRef} onSubmit={handleForm} className="sign-up-form">
        <div className="mb-3">
          <label htmlFor="signInEmail" className="form-label">
            Email adress
          </label>
          <input
            ref={addInputs}
            name="email"
            required
            type="email"
            className="form-control"
            id="signInEmail"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="signInPwd" className="form-label">
            Password
          </label>
          <input
            ref={addInputs}
            name="pwd"
            required
            type="password"
            className="form-control"
            id="signInPwd"
          />
          <p className="text-danger mt-1">{validation}</p>
        </div>

        <button className="btn btn-primary w-100">Submit</button>
        <div className="row justify-content-center mt-2">
          {loadingForm && (
            <div className="spinner-border text-primary" role="status"></div>
          )}
        </div>
      </form>
    </div>
  )
}
