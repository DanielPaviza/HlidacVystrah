import React, { Component } from 'react';
import '../styles/eventList.scss';
export class EventList extends Component {
    static displayName = EventList.name;

    constructor(props) {
        super(props);
    }

    RenderEvents() {

        let events = this.GetEventsGrouped();

        return <>
            {Object.keys(events).map(key => (
                events[key].length > 0 && (
                    <div className='urgencyContainer mt-3' key={key}>
                        <h2>{key}</h2>
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
            <div id='eventList' className='mt-4'>
                <h1 className=''>Výstrahy</h1>
                {this.RenderEvents()}
            </div>
        );
    }
}
