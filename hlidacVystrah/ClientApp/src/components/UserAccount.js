import React, { Component } from 'react';
import '../styles/userAccount.scss';
import UserLoginHelper from './UserLoginHelper';
import '../styles/spinnerAbsolute.scss';
import { Spinner } from './Spinner';

export class UserAccount extends Component {
    static displayName = UserAccount.name;

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            userEmail: null
        };

        this.loginHelper = new UserLoginHelper();
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

    render() {

        return (
            <div id="userAccount" className=''>
                {this.state.loggedIn ?
                    "useraccount"
                    :
                    <Spinner />
                }
            </div>
        );
    }
}
