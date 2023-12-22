import React, { Component } from 'react';
import { MapEvents } from "./MapEvents"; 
import { EventDetail } from "./EventDetail"; 
import { LocalityDetail } from "./LocalityDetail"; 
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import { HomeButton } from './HomeButton';
export class HomeController extends Component {
    static displayName = HomeController.name;

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loading: true,
            timestamp: "",
            eventOpened: false,
            localityOpened: false,
            selectedEvent: null,
            selectedLocality: null
        };

        
    }

    componentDidMount() {
        this.GetEvents();
    }

    HandleOpenEvent = (id) => {

        this.HandleCloseDetail();
        let event = this.state.events.find(e => e.id === id);
        if (!event)
            return;

        this.setState((prevState) => ({
            ...prevState,
            eventOpened: true,
            selectedEvent: event
        }));
    }

    HandleOpenLocality = (cisorp) => {

        this.HandleCloseDetail();

        this.setState((prevState) => ({
            ...prevState,
            localityOpened: true,
            selectedLocality: cisorp
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

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    RenderPage() {

        if (this.state.eventOpened) {
            return <EventDetail
                event={this.state.selectedEvent}
                GetEventColor={this.HandleGetEventColor}
                OpenLocalityDetail={this.HandleOpenLocality}
                ScrollToTop={this.scrollToTop}
            />
        }

        if (this.state.localityOpened) {

            return <LocalityDetail
                allEvents={this.state.events}
                targetLocality={this.state.selectedLocality}
                openEvent={this.HandleOpenEvent}
                GetEventColor={this.HandleGetEventColor}
                ScrollToTop={this.scrollToTop}
            />
        }

        return <MapEvents
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
                        <span className='d-flex justify-content-between align-items-center'>
                            {
                                (this.state.eventOpened || this.state.localityOpened) ?
                                    <HomeButton CloseDetail={this.HandleCloseDetail} />
                                    :
                                    <span></span>
                            }
                            {this.RenderTimestamp()}
                        </span>
                        
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
