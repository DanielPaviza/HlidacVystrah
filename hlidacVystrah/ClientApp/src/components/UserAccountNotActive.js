import React, { Component } from 'react';
import '../styles/userAccount.scss';
import { Spinner } from './Spinner';
import UserFormHelper from './UserFormHelper';
import axios from "axios";

export class UserAccountNotActive extends Component {
    static displayName = UserAccountNotActive.name;

    constructor(props) {
        super(props);

        this.state = {
            reSendLoading: false,
            resendResponse: null,
            emailSent: false
        };

        this.formHelper = new UserFormHelper();
    }

    ResendActivationEmail = () => {

        this.setState((prevState) => ({
            ...prevState,
            reSendLoading: true
        }));

        axios.post('/api/user/resendactivateaccountemail',
            { LoginToken: this.props.loginToken }
        )
            .then(response => {

                let data = response.data;

                this.props.HandleUserLoginExpired(data.responseCode);

                this.setState((prevState) => ({
                    ...prevState,
                    resendResponse: data.responseCode,
                    emailSent: true
                }));
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    resendResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    reSendLoading: false
                }));
            });
    }

    RenderResendEmailResponse = () => {

        if (this.state.resendResponse != null)
            setTimeout(() => {
                this.setState((prevState) => ({ ...prevState, resendResponse: null }))
            }, this.formHelper.timeoutDuration);

        switch (this.state.resendResponse) {
            case 200:
                return this.formHelper.RenderInformationText("Aktivační email byl úspěšně odeslán!", false);
            case 500:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Zkuste to později.", true);
            default:
                return;
        }
    }

    render() {

        return (
            <div className='mt-4 d-flex flex-column'>
                <h2>Účet není aktivován</h2>
                <span className='mt-1'>Při registraci jsme na email <span className='fw-bold'>{this.props.userEmail}</span> odeslali zprávu s odkazem, na kterém svůj učet aktivujete.</span>
                <span className=''>Pokud email nevidíte, zkotrolujte složku Spam.</span>
                {this.RenderResendEmailResponse()}
                {!this.state.emailSent && 
                    <>
                        <span className='mt-2'>Pokud jste aktivační email neobrželi do pár minut od odeslání, je možné ho odeslat znovu tlačítkem níže.</span>
                        <div className='position-relative mt-2'>
                            <button className='d-flex fit-content border p-2 rounded' onClick={() => this.ResendActivationEmail()}>Znovu odeslat aktivační email</button>
                            <div className='mt-5'>{this.state.reSendLoading && <Spinner />}</div>
                        </div>
                    </>    
                }
            </div>
        );
    }
}
