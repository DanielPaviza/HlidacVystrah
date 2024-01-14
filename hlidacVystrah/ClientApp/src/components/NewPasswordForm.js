import React, { useState, useEffect } from 'react';
import '../styles/userForm.scss';
import '../styles/spinnerAbsolute.scss';
import { Spinner } from './Spinner';
import { useSearchParams } from 'react-router-dom';
import UserFormHelper from './UserFormHelper';
import axios from "axios";

function NewPasswordForm({ loggedIn }) {
    // Access the token parameter from the URL
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);
    const helper = new UserFormHelper();

    useEffect(() => {
        if (TokenInvalid() && !loggedIn) {
            setResponse(400);
        }
    }, []);

    const PasswordIsValid = () => {

        let mismatch = password1 != password2;
        let tooShort = password1.length < helper.minPasswordLength;

        setPasswordMismatch(mismatch);
        setPasswordTooShort(tooShort);

        return !(mismatch || tooShort);
    }

    const HandleTogglePassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    const SetNewPassword = () => {

        setResponse(null);
        if ((TokenInvalid() && !loggedIn) || !PasswordIsValid())
            return;

        setLoading(true);

        let api = '/api/user/newpassword';
        let payload = {
            password: password1,
        };

        if (loggedIn) {
            api += 'loggedin';
            payload.loginToken = localStorage.getItem("loginToken");
        } else {
            payload.passwordResetToken = token
        } 

        axios
            .post(api, payload)
            .then((response) => {
                setResponse(response.data.responseCode);
            }).catch(err => {
                setResponse(400);
            }).finally(() => {
                setLoading(false);
                setPassword1("");
                setPassword2("");
            });
    }

    const TokenInvalid = () => {
        return (token == null || token == '');
    }

    const RenderResponseText = () => {

        switch (response) {
            case 200:
                return helper.RenderInformationText("Heslo bylo úspěšně změněno!", false);
            case 400:
                return helper.RenderInformationText("Neplatný odkaz, nebo čas na změnu hesla již vypršel!", true);
            case 500:
                return helper.RenderInformationText("Něco se nepovedlo. Zkuste to později.", true);
            default:
                return;
        }
    }

    return (
        <div className='d-flex flex-column justify-content-center p-4 p-lg-5 rounded position-relative'>
            <h2 className='mb-3 mx-auto'>Změna hesla</h2>
            <span className='mb-2 d-flex align-items-center position-relative mx-auto'>
                <i className="fa-solid fa-lock me-2"></i>
                <input className='p-1' type={`${passwordVisible ? 'text' : 'password'}`} placeholder='Heslo' value={password1} onChange={(e) => setPassword1(e.target.value)} />
                <i
                    className={`toggler fa-regular fa-eye${passwordVisible ? '-slash' : ''} position-absolute`}
                    onClick={() => HandleTogglePassword()}
                ></i>
            </span>
            <span className='mb-2 d-flex align-items-center position-relative mx-auto'>
                <i className="fa-solid fa-lock me-2"></i>
                <input className='p-1' type={`${passwordVisible ? 'text' : 'password'}`} placeholder='Heslo znovu' value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </span>
            {passwordMismatch && helper.RenderInformationText('Hesla se neshodují', true)}
            {passwordTooShort && helper.RenderInformationText('Heslo musí obsahovat alespoň 6 znaků', true)}
            {RenderResponseText()}
            <button className={`ms-auto border p-2 rounded my-2 ${loggedIn && 'whiteBg'}`} onClick={() => SetNewPassword()}>Změnit</button>
            {!loggedIn && <a href='/login' className='ms-1 d-flex justify-content-center'>Přihlašte se zde</a>}
            {loading && <Spinner />}
        </div>
    );
}

export default NewPasswordForm;