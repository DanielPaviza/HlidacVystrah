import React, { Component } from 'react';
import { MapEventList } from "./MapEventList";
import '../styles/localityDetail.scss';
export class LocalityDetail extends Component {
    static displayName = LocalityDetail.name;

    constructor(props) {
        super(props);
        this.props.ScrollToTop();
    }

    GetLocalityInfo = () => {

        let result = { region: null, name: null, cisorp: null };

        if (this.props.isRegion)
            result.region = this.props.targetId;

        Object.entries(this.props.allLocalities).forEach(([region, localities]) => {

            const locality = localities.find((item) => item.cisorp == this.props.targetId);
            if (locality)
                return result = { region, name: locality.name, cisorp: locality.cisorp };
        })
        
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
                    list.some((item) => item.cisorp == this.props.targetId)
                )
            );
        }

        return filteredEvents;
    }

    render() {

        this.events = this.GetEventsInLocality();
        this.localityInfo = this.GetLocalityInfo();

        return (
            <section id="localityDetail">
                {this.props.isRegion ?
                    <h2 className='mt-3 mt-md-4 mb-3 mb-md-4'>{this.localityInfo.region}</h2>
                    :
                    <>
                        <h2 className='mt-3 mt-md-4 mb-1'>{this.localityInfo.name}</h2>
                        <h3 className='mb-3 mb-md-4 ' role="button" onClick={() => this.props.OpenLocalityDetail(this.localityInfo.region, true)}>{this.localityInfo.region}</h3>
                    </>
                }
                <MapEventList
                    events={this.events}
                    openEvent={this.props.openEvent}
                    GetEventColor={this.props.GetEventColor}
                    mapType={"locality"}
                    localityInfo={this.localityInfo}
                    allLocalities={this.props.allLocalities}
                    OpenLocalityDetail={this.props.OpenLocalityDetail}
                    map={this.props.map}
                />
            </section>
        );
    }
}
