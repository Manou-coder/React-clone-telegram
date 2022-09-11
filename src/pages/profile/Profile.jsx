import React from 'react'
import './Profile.css'
import Avatar from '../../assets/img/avatar4.png'

export default function Profile() {
    return (
        <div className="container-fluid vh-100 p-0 d-flex justify-content-center align-items-center">
            <div className="p-4 bg-white rounded d-flex">
                <div className="profile-content">
                    <div className="profile-header text-center mb-4">
                        <h5 className='text-primary fw-bold'>My Profile</h5>
                    </div>
                    <div className="profile-body d-flex flex-column justify-content-center">
                        <form>
                            <div className="picture d-flex justify-content-center mb-4">
                                <img
                                    style={{ height: '175px', width: '175px' }}
                                    // src="https://picsum.photos/175/175?random=1"
                                    src={Avatar}
                                    className="rounded-circle"
                                    alt="..."
                                ></img>
                            </div>
                            <input
                                // ref={addInputs}
                                name="picture"
                                required
                                type='file'
                                className="form-control"
                                id="picture"
                            />
                            <div className="profile-name mt-4">
                                <div>
                                    <h6 className='text-primary'>Your Name</h6>
                                </div>
                                <input
                                    // ref={addInputs}
                                    name="name"
                                    required
                                    type='text'
                                    className="form-control"
                                    id="name"
                                />
                            </div>
                            <div className="profile-bio mt-4">
                                <div>
                                    <h6 className='text-primary'>Your bio</h6>
                                </div>
                                <input
                                    // ref={addInputs}
                                    name="bio"
                                    required
                                    type='text'
                                    className="form-control"
                                    id="bio"
                                />
                            </div>
                            <button className="btn btn-primary mt-4 w-100">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
