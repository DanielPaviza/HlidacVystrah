import React, { Component } from 'react';
import { MapEvents } from "./MapEvents";
import '../styles/localityDetail.scss';
export class LocalityDetail extends Component {
    static displayName = LocalityDetail.name;

    constructor(props) {
        super(props);
        this.state = {
            showDescription: false,
            showLocalityList: false
        };

        this.events = this.GetEventsInLocality(this.props.targetLocality)
        this.localityInfo = this.GetLocalityInfo(this.props.targetLocality);

        this.props.ScrollToTop();
    }

    GetLocalityInfo = (cisorp) => {

        let result = { region: null, locality: null };

        this.props.allEvents.forEach((event) => {
            Object.entries(event.localityList).forEach(([region, localities]) => {
                const locality = localities.find((item) => item.cisorp === cisorp);

                if (locality) {
                    result = { region, name: locality.name, cisorp: locality.cisorp };
                }
            });
        });

        return result;
    }

    GetEventsInLocality = (cisorp) => {

        const filteredEvents = this.props.allEvents.filter((event) =>
            Object.values(event.localityList).some((list) =>
                list.some((item) => item.cisorp === cisorp)
            )
        );

        return filteredEvents;
    }

    render() {

        return (
            <section id="localityDetail">
                <h1 className='mt-4 mt-md-5'>{this.localityInfo.name}</h1>
                <h2>{this.localityInfo.region}</h2>
                <MapEvents
                    events={this.events}
                    openEvent={this.props.openEvent}
                    GetEventColor={this.props.GetEventColor}
                />
            </section>
        );
    }
}
