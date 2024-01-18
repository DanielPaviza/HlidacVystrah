import React, { Component } from 'react';
import { Spinner } from './Spinner';
import axios from "axios";
import NewPasswordForm from './NewPasswordForm';
import UserFormHelper from './UserFormHelper';
import '../styles/notificationSettings.scss';

export class UserAccountSettings extends Component {
    static displayName = UserAccountSettings.name;

    constructor(props) {
        super(props);

        this.state = {
            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false,
            deleteAccountResponse: null,
            deleteLoading: false
        };

        this.formHelper = new UserFormHelper();
    }

    componentDidMount() {
        
    }

    DeleteAccount = () => {

        this.setState((prevState) => ({
            ...prevState,
            deleteLoading: true
        }));

        axios
            .post("/api/user/deleteaccount", {
                LoginToken: this.props.loginToken
            })
            .then((response) => {

                let data = response.data;
                this.props.HandleUserLoginExpired(data.responseCode);

                this.setState((prevState) => ({
                    ...prevState,
                    deleteAccountResponse: data.responseCode
                }));

                if (data.responseCode == 200)
                    window.location.href = '/';

            }).catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    deleteAccountResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    deleteLoading: false
                }));
            });
    }

    RenderDeleteAccountResponse = () => {
        switch (this.state.deleteAccountResponse) {
            case 200:
                return this.formHelper.RenderInformationText("Účet byl úspěšně smazán!", false);
            case 500:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Zkuste to později.", true);
            default:
                return;
        }
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

    render() {

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
                            <div className={`accountSettingsContent deleteAccountConfirmation accountSettingsContent p-2 pt-4 position-relative`}>
                                <h5 className='mb-3'>Opravdu si přejete smazat účet?</h5>
                                <span className='d-flex justify-content-between'>
                                    <button className='border rounded p-2 deleteAccount' onClick={() => this.DeleteAccount()}>Nenávratně smazat</button>
                                    <button className='border rounded p-2' onClick={() => this.HandleToggleDeleteAccountConfirmation()}>Zrušit</button>
                                </span>
                                <div className='mt-3'>{this.RenderDeleteAccountResponse()}</div>
                                {this.state.deleteLoading && <Spinner />}
                            </div>
                            :
                            <div className={`accountSettingsContent borderLeft p-2 pt-4 d-flex align-items-end justify-content-between`}>
                                <div className=''>
                                    <h4>Smazat účet</h4>
                                    <p>Smazání účtu se všemi údaji.</p>
                                </div>
                                <button className='border rounded p-2 deleteAccount' onClick={() => this.HandleToggleDeleteAccountConfirmation()}>Smazat</button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}
