import React, { Component } from 'react';
import { Spinner } from './Spinner';
import { UserAccountNewNotification } from './UserAccountNewNotification';
import axios from "axios";
import UserFormHelper from './UserFormHelper';
import '../styles/notificationSettings.scss';

export class UserAccountNotifications extends Component {
    static displayName = UserAccountNotifications.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            notifications: [],
            response: null,
            deleteResponse: null
        };

        this.formHelper = new UserFormHelper();
    }

    componentDidMount() {
        this.GetNotifications();
    }

    GetNotifications = () => {

        this.setState((prevState) => ({
            ...prevState,
            loading: true
        }));

        axios.post('/api/user/notifications',
            { LoginToken: "44ENRJrmnnUbqDY5YZk/y2AQtXsive+gk99NZyTVZqI="}
        )
            .then(response => {

                let data = response.data;

                this.setState((prevState) => ({
                    ...prevState,
                    notifications: data.notifications,
                    response: data.responseCode
                }));
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    response: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    loading: false
                }));
            });
    }

    RenderDeleteResponse = () => {
        switch (this.state.deleteResponse) {
            case 200:
                return this.formHelper.RenderInformationText("Výstraha smazána", false);
            case 500:
                return this.formHelper.RenderInformationText("Něco se nepovedlo. Obnovte stránku.", true);
            default:
                return;
        }
    }

    NotificationDelete = (id) => {

        this.setState((prevState) => ({
            ...prevState,
            loading: true
        }));

        axios.post('/api/user/deletenotification',
            { LoginToken: "44ENRJrmnnUbqDY5YZk/y2AQtXsive+gk99NZyTVZqI=", IdNotification: id }
        )
            .then(response => {

                let data = response.data;

                this.setState((prevState) => ({
                    ...prevState,
                    deleteResponse: data.responseCode
                }));

                this.GetNotifications();
            })
            .catch(error => {
                this.setState((prevState) => ({
                    ...prevState,
                    deleteResponse: 500
                }));
            })
            .finally(() => {
                this.setState((prevState) => ({
                    ...prevState,
                    loading: false
                }));
            });
    }

    RenderNotifications = () => {
        return (
            <div className='overflow-auto pb-3'>
                <table className='userNotifications col-12'>
                    <thead className='border-bottom '>
                        <tr className=''>
                            <th className='del'>Smazat</th>
                            <th className=''>Typ</th>
                            <th className=''>Závažnost</th>
                            <th className=''>Pravděpodobnost</th>
                            <th className=''>Oblast</th>   
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.notifications.map(notification => (
                            <tr key={notification.id} className='my-2'>
                                <td className='del'>
                                    <i className="fa-solid fa-xmark" onClick={() => this.NotificationDelete(notification.id) }></i>
                                </td>
                                <td className='d-flex align-items-center my-auto h-100'>
                                    <span>{notification.eventType}</span>
                                    <div>
                                        <img src={`/images/${notification.eventImg}`} alt='obrázek typu jevu' className='ms-2 my-auto' />
                                    </div>
                                </td>
                                <td>{notification.severity || 'Jakákoliv'}</td>
                                <td>{notification.certainty || 'Jakákoliv'}</td>
                                <td>{notification.area}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {

        return (
            <div className='mt-4 notificationSettings'>
                <h3 className='mb-4'>Správa upozornění</h3>

                {this.state.notifications.length != 0 &&
                    <>
                        <p className='fw-bold'>Sledované výstrahy</p>
                        {this.RenderDeleteResponse()}
                        <div className='position-relative'>
                            {this.state.loading ?
                                <Spinner />
                                :
                                (this.state.response == 200) ?
                                    this.RenderNotifications()
                                    :
                                    this.formHelper.RenderInformationText("Něco se nepovedlo. Zkuste to později.", true)
                            }
                        </div>
                        <div className='horLine col-12 mb-3' />
                    </>
                }
                <UserAccountNewNotification GetNotifications={this.GetNotifications} />
            </div>
        );
    }
}
