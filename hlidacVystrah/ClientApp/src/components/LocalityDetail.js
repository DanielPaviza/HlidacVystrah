import React, { Component } from 'react';
import { MapEvents } from "./MapEvents";
import '../styles/localityDetail.scss';
export class LocalityDetail extends Component {
    static displayName = LocalityDetail.name;

    constructor(props) {
        super(props);

        this.events = this.GetEventsInLocality();
        this.localityInfo = this.GetLocalityInfo();

        console.log(this.localityInfo)

        this.props.ScrollToTop();
    }

    GetLocalityInfo = () => {

        let result = { region: null, locality: null };

        if (this.props.isRegion)
            result.region = this.props.targetId;

        this.props.allEvents.forEach((event) => {
            Object.entries(event.localityList).forEach(([region, localities]) => {
                const locality = localities.find((item) => item.cisorp === this.props.targetId);

                if (locality) {
                    result = { region, name: locality.name, cisorp: locality.cisorp };
                }
            });
        });
        
        return result;
    }

    GetEventsInLocality = () => {

        let filteredEvents;

        if (this.props.isRegion) {
            filteredEvents = this.props.allEvents.filter(event =>
                Object.keys(event.localityList).includes(this.props.targetId)
            );
        } else {

            filteredEvents = this.props.allEvents.filter((event) =>
                Object.values(event.localityList).some((list) =>
                    list.some((item) => item.cisorp === this.props.targetId)
                )
            );
        }

        return filteredEvents;
    }

    render() {

        return (
            <section id="localityDetail">
                {this.props.isRegion ?
                    <h1 className='mt-4 mt-md-5'>{this.localityInfo.region}</h1>
                    :
                    <>
                        <h1 className='mt-4 mt-md-5'>{this.localityInfo.name}</h1>
                        <h2>{this.localityInfo.region}</h2>
                    </>
                }
                <MapEvents
                    events={this.events}
                    openEvent={this.props.openEvent}
                    GetEventColor={this.props.GetEventColor}
                />
            </section>
        );
    }
}
