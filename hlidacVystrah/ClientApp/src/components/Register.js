import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/loginRegister.scss';

export class Register extends Component {
    static displayName = Register.name;

    constructor(props) {
        super(props);
        this.state = {
            passwordVisible: false,
            passwordMismatch: false,
            passwordTooShort: false,
            emailError: false
        }

        this.minPasswordLength = 6;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    HandleTogglePassword = () => {

        this.setState((prevState) => ({
            ...prevState,
            passwordVisible: !this.state.passwordVisible
        }))
    }

    ValidateInputs = () => {
        let p1 = document.getElementById("p1").value;
        let p2 = document.getElementById("p2").value;
        let email = document.getElementById("email").value;

        this.setState((prevState) => ({
            ...prevState,
            passwordMismatch: p1 != p2,
            passwordTooShort: p1.length < this.minPasswordLength,
            emailError: !this.emailRegex.test(email)
        }))
    }

    RenderInputError = (text) => {
        return (
            <span className='d-flex align-items-center my-1'>
                <div className='colorCircle red me-1'></div>
                <span className=''>{text}</span>
            </span>
        );
    }

    render() {

        return (
            <>
                <NavMenu />
                <div id="register" className='d-flex justify-content-center align-items-center'>
                    <div className='d-flex flex-column justify-content-center p-4 p-lg-5 rounded'>
                        <h2 className='mb-3'>Registrace</h2>
                        <span className='mb-2 d-flex align-items-center justify-content-between'>
                            <i className="fa-solid fa-envelope me-2"></i>
                            <input id='email' className='p-1' type='text' placeholder='E-mail' />
                        </span>
                        <span className='mb-2 d-flex align-items-center justify-content-between position-relative'>
                            <i className="fa-solid fa-lock me-2"></i>
                            <input id='p1' className='p-1' type={`${this.state.passwordVisible ? 'text' : 'password'}`} placeholder='Heslo' />
                        </span>
                        <span className='mb-2 d-flex align-items-center justify-content-between position-relative'>
                            <i className="fa-solid fa-lock me-2"></i>
                            <input id='p2' className='p-1' type={`${this.state.passwordVisible ? 'text' : 'password'}`} placeholder='Heslo znovu' />
                            <i
                                className={`toggler fa-regular fa-eye${this.state.passwordVisible ? '-slash' : ''}`}
                                onClick={() => this.HandleTogglePassword()}
                            ></i>
                        </span>
                        {this.state.passwordMismatch && this.RenderInputError('Hesla se neshodují')}
                        {this.state.passwordTooShort && this.RenderInputError('Heslo musí obsahovat alespoň 6 znaků')}
                        {this.state.emailError && this.RenderInputError('Email nemá správný formát (email@priklad.xx)')}
                        <button className='ms-auto border p-2 rounded my-2' onClick={() => this.ValidateInputs()}>Registrovat</button>
                        <span className='mt-2 d-flex justify-content-center'>
                            Již máte účet?
                            <a href='/login' className='ms-1'>Přihlašte se</a>
                        </span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}
