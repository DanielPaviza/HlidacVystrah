import React, { Component } from 'react';
import '../styles/userAccount.scss';
import UserLoginHelper from './UserLoginHelper';
import { Spinner } from './Spinner';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import NewPasswordForm from './NewPasswordForm';
import axios from "axios";
import UserFormHelper from './UserFormHelper';
import { UserAccountNotifications } from './UserAccountNotifications';

export class UserAccount extends Component {
    static displayName = UserAccount.name;

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            userEmail: null,
            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false,
            deleteAccountResponse: null,
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
            ...prevState,
            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleToggleChangePassword = () => {
        this.setState((prevState) => ({
            ...prevState,
            changePasswordOpened: !this.state.changePasswordOpened
        }));
    }

    HandleToggleDeleteAccount = () => {
        this.setState((prevState) => ({
            ...prevState,
            deleteAccountOpened: !this.state.deleteAccountOpened
        }));
    }

    HandleToggleDeleteAccountConfirmation = () => {
        this.setState((prevState) => ({
            ...prevState,
            deleteAccountConfirmationOpened: !this.state.deleteAccountConfirmationOpened
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

    RenderAccountSettings = () => {
        return (
            <div className='mt-4 mb-4'>
                <h3>Správa účtu</h3>
                <div className='accountSettings d-flex flex-column'>
                    <span className={`p-2 py-3 fw-bold d-flex justify-content-between align-items-center ${this.state.changePasswordOpened && 'borderLeft'}`} onClick={() => this.HandleToggleChangePassword()}>
                        <span>Změnit heslo</span>
                        <i className={`fa-solid fa-angles-${this.state.changePasswordOpened ? 'down' : 'up'}`}></i>
                    </span>
                    {this.state.changePasswordOpened &&
                        <div className='mb-3 accountSettingsContent d-flex justify-content-center'>
                            <NewPasswordForm loggedIn={true} />
                        </div>
                    }
                    <span className={`p-2 py-3 fw-bold d-flex justify-content-between align-items-center ${this.state.deleteAccountOpened && 'borderLeft noBorderTop'}`} onClick={() => this.HandleToggleDeleteAccount()}>
                        <span>Smazat účet</span>
                        <i className={`fa-solid fa-angles-${this.state.deleteAccountOpened ? 'down' : 'up'}`}></i>
                    </span>
                    {this.state.deleteAccountOpened &&
                        (this.state.deleteAccountConfirmationOpened ? 
                        <div className={`accountSettingsContent deleteAccountConfirmation accountSettingsContent p-2 pt-4`}>
                                <h5 className='mb-3'>Opravdu si přejete smazat účet?</h5>
                                <span className='d-flex justify-content-between'>
                                    <button className='border rounded p-2 deleteAccount' onClick={() => this.DeleteAccount()}>Nenávratně smazat</button>
                                    <button className='border rounded p-2' onClick={() => this.HandleToggleDeleteAccountConfirmation()}>Zrušit</button>
                                </span>
                            </div>
                            :
                        <div className={`accountSettingsContent borderLeft p-2 pt-4 d-flex align-items-end justify-content-between`}>
                                <div className=''>
                                    <h4>Smazat účet</h4>
                                    <p>Tato volba je nevratná.</p>
                                </div>
                                <div className='mb-3'>{this.RenderDeleteAccountResponse()}</div>
                                <button className='border rounded p-2 deleteAccount' onClick={() => this.HandleToggleDeleteAccountConfirmation()}>Smazat</button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

    render() {

        return (
            this.state.loggedIn ?
                <>
                    <NavMenu logOff={true} />
                    <div id="userAccount" className='container'>
                        <UserAccountNotifications />
                        {this.RenderAccountSettings()}
                    </div>
                    <Footer background={'lightGray'} />
                </>
                :
                <Spinner />
        );
    }
}
