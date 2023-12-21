import React, { Component } from 'react';
import { Map } from "./Map"; 
import { EventList } from "./EventList"; 
import '../styles/home.scss';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="home">
                <Map events={this.props.events} />
                <EventList
                    events={this.props.events}
                    openEvent={this.props.openEvent}
                    GetEventColor={this.props.GetEventColor}
                />
            </div>
        );
    }
}
