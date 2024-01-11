import React, { Component } from 'react';
import '../styles/eventList.scss';
export class EventList extends Component {
    static displayName = EventList.name;

    constructor(props) {
        super(props);
    }

    HandleToggleLegend = () => {
        this.setState((prevState) => ({
            ...prevState,
            legendOpened: !this.state.legendOpened
        }));
    }

    RenderEvents() {

        let events = this.GetEventsGrouped();

        return this.props.events.length > 0 ? <>
            {Object.keys(events).map(key => (
                events[key].length > 0 && (
                    <div className='urgencyContainer mt-3' key={key}>
                        <h3>{key}</h3>
                        <div className='d-flex flex-wrap'>
                            {events[key].map(event => (
                                <div key={event.id} onClick={() => this.props.openEvent(event.id)} className='col-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center'>
                                    <div className={`event d-flex flex-column align-items-center ${this.props.GetEventColor(event.severity) }`}>
                                        <img alt="img" src={`images/${event.imgPath}`} />
                                        <span className=''>{event.eventType}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </>
            :
        <p className='mt-2 fw-bold'>Pro zvolenou lokalitu nejsou vydány žádné výstrahy</p>
    }

    GetEventsGrouped() {

        // Dto (specific order of keys)
        let eventDto = {
            "Aktuální": [],
            "Budoucí": [],
            "Neznámé": [],
            "Zrušené": []
        }

        // Group by urgency and map on dto
        this.props.events.reduce((eventMemo, { urgency, ...event }) => {
            eventDto[urgency].push({ urgency, ...event });
            return eventMemo;
        }, {});

        return eventDto;
    }

    render() {

        return (
            <div id='eventList' className='pb-5'>
                <span className='d-flex align-items-start justify-content-between'>
                    <h2 className='m-0'>Výstrahy</h2>
                </span>
                {this.RenderEvents()}
            </div>
        );
    }
}
