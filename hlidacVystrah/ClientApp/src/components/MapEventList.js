import React, { Component } from 'react';
import { MapEvent } from "./MapEvent"; 
import { MapLocality } from "./MapLocality"; 
import { EventList } from "./EventList"; 
import { Legend } from "./Legend";
import '../styles/mapEvents.scss';
export class MapEventList extends Component {
    static displayName = MapEventList.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="mapEvents">
                {this.props.mapType == "event" && 
                    <MapEvent
                        events={this.props.events}
                        GetEventColor={this.props.GetEventColor}
                        OpenLocalityDetail={this.props.OpenLocalityDetail}
                    />
                }
                {this.props.mapType == "locality" && 
                    <MapLocality
                        events={this.props.events}
                        GetEventColor={this.props.GetEventColor}
                        localityInfo={this.props.localityInfo}
                        localityList={this.props.localityList}
                        OpenLocalityDetail={this.props.OpenLocalityDetail}
                    />
                }
                <Legend />
                <EventList
                    events={this.props.events}
                    openEvent={this.props.openEvent}
                    GetEventColor={this.props.GetEventColor}
                />
            </div>
        );
    }
}
