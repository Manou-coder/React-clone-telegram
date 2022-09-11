import React from 'react'
import './Home.css'
import Ilustration from '../../assets/img/27.svg'

export default function Home() {
    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row w-100 h-100 m-0">
                <div className="col-12 col-md-6 p-0">
                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                        <div className="bg-white rounded p-4" style={{ minWidth: '300px' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Sign Up</h5>
                                        <button
                                            // onClick={closeModal}
                                            className="btn-close"></button>
                                    </div>

                                    <div className="modal-body">
                                        <form
                                            // ref={formRef}
                                            // onSubmit={handleForm}
                                            className="sign-up-form">
                                            <div className="mb-3">
                                                <label htmlFor="signUpEmail" className="form-label">
                                                    Email adress
                                                </label>
                                                <input
                                                    // ref={addInputs}
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
                                                    // ref={addInputs}
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
                                                    // ref={addInputs}
                                                    name="pwd"
                                                    required
                                                    type="password"
                                                    className="form-control"
                                                    id="repeatPwd"
                                                />
                                                {/* <p className="text-danger mt-1">{validation}</p> */}
                                            </div>

                                            <button className="btn btn-primary">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-none d-md-flex col-md-6 p-0">
                    <div className="d-flex justify-content-start align-items-center h-100 w-100">
                        <div >
                            <img width="600" height="600" src={Ilustration} alt="man whith computer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
