import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MapHelper from './MapHelper';
import '../styles/map.scss';
export class MapEvent extends Component {
    static displayName = MapEvent.name;

    constructor(props) {
        super(props);
        this.helper = new MapHelper(this.props.map, this.props.OpenLocalityDetail);

        this.isDetail = false;
        if (this.props.events.length == 1)
            this.isDetail = true;
    }

    render() {

        let affected = this.isDetail ? this.GetAffectedLocality() : this.GetAffectedLocalityList();

        return (
            this.helper.GetColoredMap(affected)
        );
    }

    GetAffectedLocality() {

        let affected = [];
        let event = this.props.events[0];
        let color = this.props.GetEventColor(event.severity);
        affected[color] = [];

        Object.entries(event.localityList).forEach(([region, localities]) => {
            affected[color].push(localities);
        });

        affected = this.helper.FlattenAffected(affected);

        return affected;
    }

    GetAffectedLocalityList = () => {

        let affected = {};
        affected["noEvent"] = [];
        Object.entries(this.props.allLocalities).forEach(([region, localities]) => {
            affected["noEvent"].push(localities);
        })

        this.props.events.forEach((event) => {
            Object.entries(event.localityList).forEach(([region, localities]) => {
                let severityColor = this.props.GetEventColor(event.severity);
                if (!affected.hasOwnProperty(severityColor))
                    affected[severityColor] = [];
                affected[severityColor].push(localities);
            });
        });

        affected = this.helper.FlattenAffected(affected);
        affected = this.helper.FilterLessSevereLocalities(affected);

        return affected;
    }
}
