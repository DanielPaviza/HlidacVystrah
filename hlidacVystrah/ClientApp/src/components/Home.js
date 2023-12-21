import React, { Component } from 'react';
import { Map } from "./Map"; 
import { EventList } from "./EventList"; 
import '../styles/home.scss';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { events: [], loading: true };
    }

    componentDidMount() {
        this.GetEvents();
    }

    render() {

        return (
            <div id="home">
                {
                    this.state.loading ?
                        <div>Loading ...</div>
                        :
                        <>
                            <Map events={this.state.events} />
                            <EventList events={this.state.events} />
                        </>
                }
            </div>
        );
    }

    async GetEvents() {
        const response = await fetch('api/events');
        const data = await response.json();

        console.log(data);

        if(data.responseCode == 200)
            this.setState({ events: data.events, loading: false });
    }
}
