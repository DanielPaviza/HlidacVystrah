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
import { Prev } from '../../../../node_modules/react-bootstrap/esm/PageItem';

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
            notificationOptions: null,
            notificationOptionsLoading: true,
            notificationOptionsResponse: null,
            eventTypeOptions: [],
            severityOptions: [],
            certainityOptions: [],
            localityOptions: []
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

        this.GetNotificationOptions();
    }

    GetNotificationOptions = () => {

        axios.get('/api/user/eventnotificationoptions')
            .then(response => {

                let data = response.data;
                this.setState((prevState) => ({
                    ...prevState,
                    notificationOptionsResponse: data.responseCode
                }));

                if (data.responseCode != 200)
                    return;

                this.setState((prevState) => ({
                    ...prevState,
                    eventTypeOptions: data.eventTypeList,
                    severityOptions: data.severityList,
                    certainityOptions: data.certainityList,
                    localityOptions: data.localityList
                }));
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    notificationOptionsResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    notificationOptionsLoading: false
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

    HandleOpenChangePassword = () => {
        this.setState((prevState) => ({
            ...prevState,
            changePasswordOpened: true,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleOpenDeleteAccount = () => {
        this.setState((prevState) => ({
            ...prevState,
            changePasswordOpened: false,
            deleteAccountOpened: true,
            deleteAccountConfirmationOpened: false
        }));
    }

    HandleOpenDeleteAccountConfirmation = () => {
        this.setState((prevState) => ({
            ...prevState,
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

    RenderAccountSettings = () => {
        return (
            <div className='mt-4'>
                <h3>Správa účtu</h3>
                <div className='accountSettings'>
                    <span>
                        <button className={`border p-2 ${this.state.changePasswordOpened && 'noBottomBorder darkerBg'} ${(!this.state.changePasswordOpened && !this.state.deleteAccountOpened) && 'borderBottom'}`} onClick={() => this.HandleOpenChangePassword()}>
                            Změnit heslo
                        </button>
                        <button className={`border p-2 ${(this.state.deleteAccountOpened || this.state.deleteAccountConfirmationOpened) && 'noBottomBorder darkerBg'} ${(!this.state.changePasswordOpened && !this.state.deleteAccountOpened) && 'borderBottom'}`} onClick={() => this.HandleOpenDeleteAccount()}>
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
                            <button className='border rounded p-2 whiteBg deleteAccount' onClick={() => this.HandleOpenDeleteAccountConfirmation()}>Smazat</button>
                        </div>
                    }
                    {this.state.deleteAccountConfirmationOpened &&
                        <div className='accountSettingsContent deleteAccountConfirmation accountSettingsContent p-2 pt-4 border position-relative'>
                            <i className="close fa-solid fa-xmark position-absolute" onClick={() => this.CloseAccountSettings()} />
                            <h5 className='mb-3'>Opravdu si přejete smazat účet?</h5>
                            <div className='mb-3'>{this.RenderDeleteAccountResponse()}</div>
                            <span className='d-flex justify-content-between'>
                                <button className='border rounded p-2 whiteBg deleteAccount' onClick={() => this.DeleteAccount()}>Nenávratně smazat</button>
                                <button className='border rounded p-2 whiteBg' onClick={() => this.setState((prevState) => ({ deleteAccountConfirmationOpened: false }))}>Zrušit</button>
                            </span>
                        </div>
                    }
                </div>
            </div>
        );
    }

    RenderNotificationSettings = () => {
        return (
            <div className='mt-4 notificationSettings'>
                <h3>Správa upozornění</h3>
                <p className='fw-bold'>Sledované výstrahy</p>

                <p className='fw-bold mb-2'>Přidat sledovanou výstrahu</p>
                <div className='d-flex flex-wrap justify-content-between'>
                    <div className='selectBox d-flex flex-column'>
                        <label>Typ výstrahy</label>
                        <select className='border'>
                            {this.state.eventTypeOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}

                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='selectBox d-flex flex-column '>
                        <label>Závažnost</label>
                        <select className='border'>
                            <option value={null}>Jakákoliv</option>
                            {this.state.severityOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='selectBox d-flex flex-column mt-2 mt-md-0'>
                        <label>Pravděpodobnost</label>
                        <select className='border'>
                            <option value={null}>Jakákoliv</option>
                            {this.state.certainityOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='selectBox d-flex flex-column mt-2 mt-md-0'>
                        <label>Lokalita</label>
                        <select className='border'>
                            {this.state.localityOptions.map((option) => (
                                <option key={option.cisorp} value={option.cisorp}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <span className='d-flex justify-content-end mt-3'>
                    <button className='border p-2 rounded'>Přidat</button>
                </span>
            </div>
        );
    }

    render() {

        return (
            this.state.loggedIn ?
                <>
                    <NavMenu logOff={true} />
                    <div id="userAccount" className='container'>
                        {this.RenderNotificationSettings()}
                        {this.RenderAccountSettings()}
                    </div>
                    <Footer background={'lightGray'} />
                </>
                :
                <Spinner />
        );
    }
}
