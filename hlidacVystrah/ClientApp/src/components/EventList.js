import React, { Component } from 'react';
import '../styles/eventList.scss';
export class EventList extends Component {
    static displayName = EventList.name;

    constructor(props) {
        super(props);
    }

    render() {

        let events = {
            past: [],
            future: [],
            unknown: [],
            actual: [],
        }

        for (let index in this.props.events) {

            let _event = this.props.events[index];
            switch (_event.urgency.toLowerCase()) {
                case "past":
                    events.past.push(_event);
                    break;
                case "future":
                    events.future.push(_event);
                    break;
                case "unknown":
                    events.future.push(_event);
                    break;
                default:
                    events.actual.push(_event);
            }
        }

        return (
            <div>skrrr</div>
        );
    }
}
