import React, { Component } from 'react';
import { MapEventList } from "./MapEventList"; 
import { EventDetail } from "./EventDetail"; 
import { LocalityDetail } from "./LocalityDetail"; 
import { NavMenu } from './NavMenu';
import { Search } from './Search';
import { Footer } from './Footer';
import SiteHistory from './SiteHistory';
import { BackButton } from './BackButton';
import { Loading } from './Loading';

export class HomeController extends Component {
    static displayName = HomeController.name;

    constructor(props) {
        super(props);
        this.state = {
            timestamp: '',
            eventOpened: false,
            localityOpened: false,
            selectedEventId: null,
            selectedLocalityId: null,
            selectedLocalityIsRegion: false,
            localityList: [],
            localityListLoading: true,
            eventList: [],
            eventListLoading: true,
            map: [],
        };

    }

    componentDidMount() {
        this.GetEventList();
        this.GetLocalityList();
        this.GetSvgMap();

        this.history = this.InitializeSiteHistory();
    }

    InitializeSiteHistory = () => {

        let savedHistory = JSON.parse(localStorage.getItem("history"));
        if (!savedHistory)
            savedHistory = [];

        return new SiteHistory(
            this.HandleCloseDetail,
            this.HandleOpenEvent,
            this.HandleOpenLocality,
            savedHistory
        );
    }

    HandleOpenEvent = (id) => {

        this.HandleCloseDetail();
        if (this.history)
            this.history.AddRecord("event", id);

        this.setState((prevState) => ({
            ...prevState,
            eventOpened: true,
            selectedEventId: id,
        }));
    }

    HandleOpenLocality = (id, isRegion = false) => {

        this.HandleCloseDetail();

        let historySiteName = isRegion ? "region" : "locality";
        if(this.history)
            this.history.AddRecord(historySiteName, id);

        this.setState((prevState) => ({
            ...prevState,
            localityOpened: true,
            selectedLocalityId: id,
            selectedLocalityIsRegion: isRegion,
        }));
    }

    HandleOpenHome = () => {
        this.HandleCloseDetail();
        if (this.history)
            this.history.AddRecord("home");
    }

    HandleCloseDetail = () => {
        this.setState((prevState) => ({
            ...prevState,
            eventOpened: false,
            localityOpened: false,
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
                svgMapElements={this.state.svgMapElements}
                map={this.state.map}
                allLocalities={this.state.localityList}
                CloseDetail={this.HandleCloseDetail}
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
                map={this.state.map}
            />
        }

        return <section id='home'>
            <h2 className='mt-3 mb-3 mt-lg-4 mb-lg-4'>Meteorologické výstrahy v České Republice</h2>
            <Search
                localityList={this.state.localityList}
                OpenLocalityDetail={this.HandleOpenLocality}
            />
            <MapEventList
                events={this.state.eventList}
                openEvent={this.HandleOpenEvent}
                GetEventColor={this.HandleGetEventColor}
                mapType={'event'}
                OpenLocalityDetail={this.HandleOpenLocality}
                map={this.state.map}
                allLocalities={this.state.localityList}
            />
        </section>
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
            this.state.eventListLoading || this.state.localityListLoading || this.state.map.length <= 0 ?
                <Loading />
                :
                <>
                    <NavMenu CloseDetail={this.HandleCloseDetail} NavigateHome={this.HandleOpenHome} />
                    <div className='container mt-3'>
                        <span className='d-flex justify-content-between '>
                            <BackButton history={this.history} NavigateHome={this.HandleOpenHome} />
                            {this.RenderTimestamp()}
                        </span>  
                        {this.RenderPage()}
                    </div>
                    <Footer background={'lightGray'} />
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

    async GetSvgMap() {
        fetch('/images/map.svg')
            .then(response => {
                if (!response.ok)
                    throw new Error('Network response was not ok');

                return response.text()
            })
            .then(map => {

                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(map, 'image/svg+xml');
                let gs = Array.from(svgDoc.children[0].children[0].children);

                this.setState((prevState) => ({
                    ...prevState,
                    map: gs
                }));
            })
            .catch(error => {
                console.error('Error during fetch:', error);
            });
    }
}
