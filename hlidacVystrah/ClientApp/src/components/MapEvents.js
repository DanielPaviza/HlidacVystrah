import React, { Component } from 'react';
import { Map } from "./Map"; 
import { EventList } from "./EventList"; 
import { Legend } from "./Legend";
import '../styles/mapEvents.scss';
export class MapEvents extends Component {
    static displayName = MapEvents.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="mapEvents">
                <Map events={this.props.events} />
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
