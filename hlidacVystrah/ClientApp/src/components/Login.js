import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/login.scss';

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            passwordVisible: false
        }
    }

    HandleTogglePassword = () => {
        this.setState({passwordVisible: !this.state.passwordVisible})
    }

    render() {

        return (
            <>
                <NavMenu />
                <div id="login" className='d-flex justify-content-center align-items-center'>
                    <div className='d-flex flex-column justify-content-center p-4 p-lg-5 rounded'>
                        <h2 className='mb-3'>Přihlašte se</h2>
                        <span className='mb-2 d-flex align-items-center justify-content-between'>
                            <i className="fa-solid fa-envelope me-2"></i>
                            <input className='p-1' type='text' placeholder='E-mail'/>
                        </span>
                        <span className='mb-2 d-flex align-items-center justify-content-between position-relative'>
                            <i className="fa-solid fa-lock me-2"></i>
                            <input className='p-1' type={`${this.state.passwordVisible ? 'text' : 'password'}`} placeholder='Heslo' />
                            <i
                                className={`toggler fa-regular fa-eye${this.state.passwordVisible ? '-slash' : ''}`}
                                onClick={() => this.HandleTogglePassword()}
                            ></i>
                        </span>
                        <a href='/forgotpassword' className='d-flex mt-1'>Zapomněli jste heslo?</a>
                        <button className='ms-auto border p-2 rounded my-2'>Přihlásit</button>
                        <span className='mt-2 d-flex justify-content-center'>
                            Nemáte účet?
                            <a href='/register' className='ms-1'>Zaregistrujte se</a>
                        </span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}
