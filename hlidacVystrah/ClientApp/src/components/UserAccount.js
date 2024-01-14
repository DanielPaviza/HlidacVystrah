import React, { Component } from 'react';
import '../styles/userAccount.scss';
import UserLoginHelper from './UserLoginHelper';
import '../styles/spinnerAbsolute.scss';
import { Spinner } from './Spinner';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import NewPasswordForm from './NewPasswordForm';
import axios from "axios";
import UserFormHelper from './UserFormHelper';

export class UserAccount extends Component {
    static displayName = UserAccount.name;

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            userEmail: null,
            changePasswordOpened: false,
            deleteAccountOpened: true,
            deleteAccountConfirmationOpened: false,
            deleteAccountResponse: null
        };

        this.loginHelper = new UserLoginHelper();
        this.formHelper = new UserFormHelper();
    }

    componentDidMount() {
        this.loginHelper.TokenLogin().then(tokenLoginResponse => {

            if (!tokenLoginResponse.loggedIn) {
                window.location.href = '/login';
                return;
            }
                
            this.setState((prevState) => ({
                ...prevState,
                loggedIn: tokenLoginResponse.loggedIn,
                userEmail: tokenLoginResponse.userEmail
            }));
        });
    }

    CloseAccountSettings = () => {
        this.setState((prevState) => ({
            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleOpenChangePassword = () => {
        this.setState((prevState) => ({
            changePasswordOpened: true,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleOpenDeleteAccount = () => {
        this.setState((prevState) => ({
            changePasswordOpened: false,
            deleteAccountOpened: true,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleOpenDeleteAccountConfirmation = () => {
        this.setState((prevState) => ({
            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: true
        }));
    }

    DeleteAccount = () => {

        axios
            .post("/api/user/deleteaccount", {
                LoginToken: localStorage.getItem("loginToken")
            })
            .then((response) => {
                this.setState((prevState) => ({
                    ...prevState,
                    deleteAccountResponse: response.data.responseCode
                }));

                if (response.data.responseCode == 200)
                    window.location.href = '/';
            });
    }

    RenderDeleteAccountResponse = () => {
        switch (this.state.deleteAccountResponse) {
            case 200:
                return this.formHelper.RenderInformationText("Účet byl úspěšně smazán!", false);
            case 409:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Přihlášení vypršelo!", true);
            case 500:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Zkuste to později.", true);
            default:
                return;
        }
    }

    render() {

        return (
            this.state.loggedIn ?
                <>
                    <NavMenu logOff={true} />
                    <div id="userAccount" className='container'>
                        <div className='mt-4'>
                            <h3>Správa účtu</h3>
                            <div className='accountSettings'>
                                <span>
                                    <button className={`border p-2 ${this.state.changePasswordOpened && 'noBottomBorder darkerBg'} ${(!this.state.changePasswordOpened && !this.state.deleteAccountOpened) && 'borderBottom'}`} onClick={() => this.HandleOpenChangePassword() }>
                                        Změnit heslo
                                    </button>
                                    <button className={`border p-2 ${this.state.deleteAccountOpened && 'noBottomBorder darkerBg'} ${(!this.state.changePasswordOpened && !this.state.deleteAccountOpened) && 'borderBottom'}`} onClick={() => this.HandleOpenDeleteAccount() }>
                                        Smazat účet
                                    </button>
                                </span>
                                {this.state.changePasswordOpened &&
                                    <div className='accountSettingsContent p-2 pt-4 border position-relative'>
                                        <i className="close fa-solid fa-xmark position-absolute" onClick={() => this.CloseAccountSettings()} />
                                        <div className='d-flex justify-content-center mx-auto position-relative'>
                                            <NewPasswordForm loggedIn={true} />
                                        </div>
                                    </div>
                                }
                                {this.state.deleteAccountOpened &&
                                    <div className='accountSettingsContent p-2 pt-4 border position-relative d-flex align-items-end justify-content-between'>
                                        <i className="close fa-solid fa-xmark position-absolute" onClick={() => this.CloseAccountSettings()} />
                                        <div className=''>
                                            <h4>Smazat účet</h4>
                                            <p>Tato volba je nevratná.</p>
                                        </div>
                                        <button className='border rounded p-2 whiteBg deleteAccount' onClick={() => this.HandleOpenDeleteAccountConfirmation() }>Smazat</button> 
                                    </div>
                                }
                                {this.state.deleteAccountConfirmationOpened &&
                                    <div className='accountSettingsContent deleteAccountConfirmation accountSettingsContent p-2 pt-4 border position-relative'>
                                        <i className="close fa-solid fa-xmark position-absolute" onClick={() => this.CloseAccountSettings()} />
                                        <h5 className='mb-3'>Opravdu si přejete smazat účet?</h5>
                                        <div className='mb-3'>{this.RenderDeleteAccountResponse()}</div>
                                        <span className='d-flex justify-content-between'>
                                            <button className='border rounded p-2 whiteBg deleteAccount' onClick={() => this.DeleteAccount()}>Nenávratně smazat</button>
                                            <button className='border rounded p-2 whiteBg' onClick={() => this.setState((prevState) => ({deleteAccountConfirmationOpened: false})) }>Zrušit</button>
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <Footer background={'lightGray'} />
                </>
                :
                <Spinner />
        );
    }
}
