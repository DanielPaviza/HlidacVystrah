import React, { Component } from 'react';
import { Spinner } from './Spinner';
import axios from "axios";
import UserFormHelper from './UserFormHelper';

export class UserAccountNewNotification extends Component {
    static displayName = UserAccountNewNotification.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            optionsResponse: null,
            createResponse: null,

            eventTypeOptions: [],
            severityOptions: [],
            certaintyOptions: [],
            localityOptions: [],
        };

        this.formHelper = new UserFormHelper();
    }

    componentDidMount() {
        this.GetNotificationOptions();
    }

    GetNewNotificationPayload = () => {
        let idEventType = document.getElementById("selectEventType").value;
        let idSeverity = document.getElementById("selectSeverity").value;
        let idcertainty = document.getElementById("selectcertainty").value;
        let idArea = document.getElementById("selectArea").value.split(':')[0];
        let isRegion = document.getElementById("selectArea").value.split(':')[1];

        if (idSeverity == "Jakákoliv")
            idSeverity = null;

        if (idcertainty == "Jakákoliv")
            idcertainty = null;

        isRegion = isRegion == "0" ? false : true;

        return {
            "LoginToken": this.props.loginToken,
            "IdEventType": idEventType,
            "IdSeverity": idSeverity,
            "Idcertainty": idcertainty,
            "IdArea": idArea,
            "IsRegion": isRegion,
        };
    }

    GetNotificationOptions = () => {

        axios.get('/api/user/notificationoptions')
            .then(response => {

                let data = response.data;

                this.props.HandleUserLoginExpired(data.responseCode);

                this.setState((prevState) => ({
                    ...prevState,
                    optionsResponse: data.responseCode,
                    eventTypeOptions: data.eventTypeList,
                    severityOptions: data.severityList,
                    certaintyOptions: data.certaintyList,
                    localityOptions: data.localityList
                }));
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    optionsResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    loading: false
                }));
            });
    }

    SetNewNotification = () => {

        this.setState((prevState) => ({
            ...prevState,
            loading: true
        }));

        let payload = this.GetNewNotificationPayload();

        axios.post('/api/user/addnotification', payload)
            .then(response => {

                let data = response.data;

                this.props.HandleUserLoginExpired(data.responseCode);

                this.setState((prevState) => ({
                    ...prevState,
                    createResponse: data.responseCode
                }));

                this.props.GetNotifications();
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    createResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    loading: false
                }));
            });
    }

    RenderCreateResponse = () => {

        if (this.state.createResponse != null)
            setTimeout(() => {
                this.setState((prevState) => ({ ...prevState, createResponse: null }))
            }, this.formHelper.timeoutDuration);

        switch (this.state.createResponse) {
            case 200:
                return this.formHelper.RenderInformationText("Výstraha úspěšně uložena", false);
            case 409:
                return this.formHelper.RenderInformationText("Výstraha je již uložena", true);
            case 500:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Obnovte stránku.", true);
            default:
                return;
        }
    }

    RenderContent = () => {
        return (
            this.state.optionsResponse == 200 ?
                <>
                    <div className='d-flex flex-wrap justify-content-between'>
                        <div className='selectBox d-flex flex-column'>
                            <label>Typ výstrahy</label>
                            <select id='selectEventType' className='border'>
                                {this.state.eventTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='selectBox d-flex flex-column '>
                            <label>Závažnost</label>
                            <select id='selectSeverity' className='border'>
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
                            <select id='selectcertainty' className='border'>
                                <option value={null}>Jakákoliv</option>
                                {this.state.certaintyOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='selectBox d-flex flex-column mt-2 mt-md-0'>
                            <label>Lokalita</label>
                            <select id='selectArea' className='border'>
                                {Object.entries(this.state.localityOptions).map(([region, localities]) => (
                                    <React.Fragment key={region}>
                                        <option value={region + ':1'} className='fw-bold'>{region}</option>
                                        {localities.map(locality => (
                                            <option key={locality.cisorp} value={locality.cisorp + ':0'}>
                                                {locality.name}
                                            </option>
                                        ))}}; 
                                    </React.Fragment>             
                                ))}
                            </select>
                        </div>
                    </div>
                    <span className='d-flex justify-content-end mt-3'>
                        <button className='border-0 p-2 rounded' onClick={() => this.SetNewNotification() }>Přidat</button>
                    </span>
                </>
                :
                this.formHelper.RenderInformationText("Něco se nepovedlo. Obnovte stránku.", true)
        );
    }

    render() {

        return (
                <div className=''>
                <p className='fw-bold mb-2'>Přidat sledovanou výstrahu</p>
                {this.RenderCreateResponse()}
                    {this.state.loading ? 
                        <Spinner />
                        :
                        this.RenderContent()
                    }
                </div>
        );
    }
}
