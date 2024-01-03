import React, { Component } from 'react';
import MapHelper from './MapHelper';
import '../styles/map.scss';
export class MapLocality extends Component {
    static displayName = MapLocality.name;

    constructor(props) {
        super(props);
        this.helper = new MapHelper(this.props.map, this.props.OpenLocalityDetail);
    }

    render() {

        let affected = this.GetAffected();

        return (
            this.helper.GetColoredMap(affected)
        );
    }

    GetAffected() {
        this.isRegion = this.props.localityInfo.name == null;
        let affected = {}
        if (this.isRegion) {
            let localityList = this.props.localityList[this.props.localityInfo.region];
            affected = this.GetAffectedRegion(localityList);
        } else {
            let severityColor = this.GetMostSevereColor();
            affected[severityColor] = [this.props.localityInfo];
        }

        return affected;
    }

    GetMostSevereColor() {

        // ordeder by severity (desc)
        let colors = [
            "red",
            "orange",
            "yellow",
            "green",
            "gray"
        ];
        // defaultval
        let color = "noEventStroke";

        let colorSet = false;
        colors.forEach(c => {
            if (!colorSet && this.EventsContainSeverity(c)) {
                color = c;
                colorSet = true;
            }
        })

        return color;
    }

    GetAffectedRegion = (regionLocalityList) => {

        let affected = {};
        affected["noEvent"] = regionLocalityList;
        affected["noEventStroke"] = regionLocalityList;

        this.props.events.forEach(event => {

            let severityColor = this.props.GetEventColor(event.severity);
            Object.entries(event.localityList).forEach(([region, localities]) => {

                regionLocalityList.forEach(regionLocality => {
                    if (localities.some(obj => obj.cisorp === regionLocality.cisorp)) {
                        if (!affected.hasOwnProperty(severityColor))
                            affected[severityColor] = [];
                        affected[severityColor].push(regionLocality);
                    } 
                })
            })
        })

        affected = this.helper.FilterLessSevereLocalities(affected);

        return affected;
    }

    EventsContainSeverity = (severityColor) => {

        let contains = false;

        this.props.events.forEach(event => {

            let color = this.props.GetEventColor(event.severity);
            if (!contains && color == severityColor)
                contains = true;
        })

        return contains;
    }
}
