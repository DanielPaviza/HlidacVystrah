import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/loginRegister.scss';

export class ResetPassword extends Component {
    static displayName = ResetPassword.name;

    constructor(props) {
        super(props);

        this.state = {
            passwordVisible: false
        }
    }

    render() {

        return (
            <>
                <NavMenu />
                <div id="resetpassword" className='d-flex justify-content-center align-items-center'>
                    <div className='d-flex flex-column justify-content-center p-4 p-lg-5 rounded'>
                        <h2 className='mb-2 mx-auto'>Zapomněli jste heslo?</h2>
                        <p className='mb-4 w-100 d-inline-block'>Na zadaný email Vám přijde zpráva s odkazem na nastavení nového hesla.</p>
                        <div className='resetPasswordInputButton mx-auto d-flex flex-column'>
                            <span className='mb-2 d-flex align-items-center justify-content-center'>
                                <i className="fa-solid fa-envelope me-2"></i>
                                <input className='p-1' type='text' placeholder='E-mail' />
                            </span>
                            <button className='ms-auto border p-2 rounded my-2'>Odeslat</button>
                            <a href='/login' className='ms-1 d-flex justify-content-center'>Přihlašte se zde</a>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}
