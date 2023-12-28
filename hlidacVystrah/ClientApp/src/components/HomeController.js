import React, { Component } from 'react';
import { MapEventList } from "./MapEventList"; 
import { EventDetail } from "./EventDetail"; 
import { LocalityDetail } from "./LocalityDetail"; 
import { NavMenu } from './NavMenu';
import { Search } from './Search';
import { Footer } from './Footer';
import { HomeButton } from './HomeButton';
export class HomeController extends Component {
    static displayName = HomeController.name;

    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            eventListLoading: true,
            timestamp: "",
            eventOpened: false,
            localityOpened: false,
            selectedEventId: null,
            selectedLocalityId: null,
            selectedLocalityIsRegion: false,
            localityList: [],
            localityListLoading: true
        };
    }

    componentDidMount() {
        this.GetEventList();
        this.GetLocalityList();
    }

    HandleOpenEvent = (id) => {

        this.HandleCloseDetail();

        this.setState((prevState) => ({
            ...prevState,
            eventOpened: true,
            selectedEventId: id
        }));
    }

    HandleOpenLocality = (id, isRegion = false) => {

        this.HandleCloseDetail();

        this.setState((prevState) => ({
            ...prevState,
            localityOpened: true,
            selectedLocalityId: id,
            selectedLocalityIsRegion: isRegion
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
                allEvents={this.state.eventList}
                targetId={this.state.selectedEventId}
                GetEventColor={this.HandleGetEventColor}
                OpenLocalityDetail={this.HandleOpenLocality}
                ScrollToTop={this.scrollToTop}
            />
        }

        if (this.state.localityOpened) {

            return <LocalityDetail
                allLocalities={this.state.localityList}
                allEvents={this.state.eventList}
                targetId={this.state.selectedLocalityId}
                isRegion={this.state.selectedLocalityIsRegion}
                openEvent={this.HandleOpenEvent}
                OpenLocalityDetail={this.HandleOpenLocality}
                GetEventColor={this.HandleGetEventColor}
                ScrollToTop={this.scrollToTop}
            />
        }

        return <>
            <Search
                localityList={this.state.localityList}
                OpenLocalityDetail={this.HandleOpenLocality}
            />
            <MapEventList
                events={this.state.eventList}
                openEvent={this.HandleOpenEvent}
                GetEventColor={this.HandleGetEventColor}
                mapType={'event'}
                localityList={this.state.localityList}
                OpenLocalityDetail={this.HandleOpenLocality}
            />
        </>
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
            this.state.eventListLoading || this.state.localityListLoading ?
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

    async GetEventList() {
        const response = await fetch('api/events');
        const data = await response.json();

        console.log(data);

        if (data.responseCode == 200)
            this.setState((prevState) => ({
                ...prevState,
                eventList: data.events,
                eventListLoading: false,
                timestamp: data.dataTimestamp,
            }));
    }

    async GetLocalityList() {
        const response = await fetch('api/localities');
        const data = await response.json();

        console.log(data);

        if (data.responseCode == 200)
            this.setState((prevState) => ({
                ...prevState,
                localityList: data.localityList,
                localityListLoading: false
            }));
    }
}
