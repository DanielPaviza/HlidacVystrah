import React, { Component } from 'react';
import { Home } from "./Home"; 
import { EventDetail } from "./EventDetail"; 
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/home.scss';
export class HomeController extends Component {
    static displayName = HomeController.name;

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loading: true,
            timestamp: "",
            eventOpened: false,
            selectedEvent: -1,
            localityOpened: false,
            selectedLocality: -1
        };
    }

    componentDidMount() {
        this.GetEvents();
    }

    HandleOpenEvent = (id) => {

        let event = this.state.events.find(e => e.id === id);
        if (!event)
            return;

        this.setState((prevState) => ({
            ...prevState,
            eventOpened: true,
            selectedEvent: event
        }));
    }

    HandleCloseDetail = () => {
        this.setState((prevState) => ({
            ...prevState,
            eventOpened: false,
            localityOpened: false
        }));
    }

    HandleGetEventColor = (severity) => {

        let color;
        severity = severity.toLowerCase();
        switch (severity) {
            case "minimální":
                color = "green";
                break;
            case "nízká":
                color = "yellow";
                break;
            case "vysoká":
                color = "orange";
                break;
            case "extrémní":
                color = "red";
                break;
            default:
                color = "gray";
        }

        return color;
    }

    RenderPage() {

        if (this.state.eventOpened) {
            return <EventDetail
                event={this.state.selectedEvent}
                closeDetail={this.HandleCloseDetail}
                GetEventColor={this.HandleGetEventColor}
            />
        }

        return <Home
            events={this.state.events}
            openEvent={this.HandleOpenEvent}
            GetEventColor={this.HandleGetEventColor}
        />
    }

    RenderTimestamp() {
        return (
            <div className='d-flex justify-content-end'>
                <div className='d-flex flex-column'>
                    <span className='border-bottom'>Poslední aktualizace</span>
                    <span>{this.state.timestamp}</span>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.state.loading ?
                <p>Loading...</p>
                :
                <>
                    <NavMenu closeDetail={this.HandleCloseDetail} />
                    <div className='container'>
                        {this.RenderTimestamp()}
                        {this.RenderPage()}
                    </div>
                    <Footer />
                </>
        );
    }

    async GetEvents() {
        const response = await fetch('api/events');
        const data = await response.json();

        console.log(data);

        if (data.responseCode == 200)
            this.setState((prevState) => ({
                ...prevState,
                events: data.events,
                loading: false,
                timestamp: data.dataTimestamp,
            }));
    }
}
