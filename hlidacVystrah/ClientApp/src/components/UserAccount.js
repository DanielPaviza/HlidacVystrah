import React, { Component } from 'react';
import '../styles/userAccount.scss';
import UserLoginHelper from './UserLoginHelper';
import { Spinner } from './Spinner';
import { Login } from './Login';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import { UserAccountSettings } from './UserAccountSettings';
import UserFormHelper from './UserFormHelper';
import { UserAccountNotifications } from './UserAccountNotifications';

export class UserAccount extends Component {
    static displayName = UserAccount.name;

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            userEmail: null,
            loginToken: "",
            tokenExpired: false,

            changePasswordOpened: false,
            deleteAccountOpened: false,
            deleteAccountConfirmationOpened: false,
            deleteAccountResponse: null,

            loading: true
        };

        this.loginHelper = new UserLoginHelper();
        this.formHelper = new UserFormHelper();
    }

    componentDidMount() {
        this.loginHelper.TokenLogin().then(tokenLoginResponse => {

            this.setState((prevState) => ({
                ...prevState,
                loggedIn: tokenLoginResponse.loggedIn,
                userEmail: tokenLoginResponse.userEmail,
                loginToken: tokenLoginResponse.loginToken,
                loading: false
            }));
        });
    }

    HandleUserLoggedIn = (token) => {
        this.setState((prevState) => ({
            ...prevState,
            loginToken: token,
            loggedIn: true,
            loginExpired: false
        }));
    }

    HandleUserLoginExpired = (statusCode, goHome = false) => {

        if (statusCode != 400 && statusCode != 401)
            return;

        localStorage.removeItem("loginToken");
        this.setState((prevState) => ({
            ...prevState,
            loggedIn: false,
            loginToken: null,
            loginExpired: true
        }));

        if (goHome)
            window.location.href = '/';
    }

    render() {

        return (

            this.state.loading ?
                <Spinner />
                :
                this.state.loggedIn ?
                    <>
                        <NavMenu HandleUserLoginExpired={this.HandleUserLoginExpired} />
                        <div id="userAccount" className='container'>
                            <UserAccountNotifications loginToken={this.state.loginToken} HandleUserLoginExpired={this.HandleUserLoginExpired} />
                            <UserAccountSettings loginToken={this.state.loginToken} HandleUserLoginExpired={this.HandleUserLoginExpired} />
                        </div>
                        <Footer background={'lightGray'} />
                    </>
                    :
                    <Login HandleUserLoggedIn={this.HandleUserLoggedIn} loginExpired={this.state.loginExpired} />
        );
    }
}
