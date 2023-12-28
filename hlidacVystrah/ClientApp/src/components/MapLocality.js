import React, { Component } from 'react';
import { ReactComponent as Img } from '../map.svg';
import MapHelper from './MapHelper';
import '../styles/map.scss';
export class MapLocality extends Component {
    static displayName = MapLocality.name;

    constructor(props) {
        super(props);
        this.helper = new MapHelper();
    }

    componentDidMount() {

        this.isRegion = this.props.localityInfo.name == null;
        let affected = {}
        if (this.isRegion) {

            let localityList = this.props.localityList[this.props.localityInfo.region];
            affected = this.GetAffectedLocalityList(localityList);


        } else {
            let severityColor = this.GetMostSevereColor();
            affected[severityColor] = [this.props.localityInfo];
        }

        this.helper.RenderLocalityColor(affected);
    }

    GetMostSevereColor() {

        if (this.EventsContainSeverity("red"))
            return "red";

        if (this.EventsContainSeverity("orange"))
            return "orange";

        if (this.EventsContainSeverity("yellow"))
            return "yellow";

        if (this.EventsContainSeverity("green"))
            return "green";

        if (this.EventsContainSeverity("gray"))
            return "gray";

        return "gray";
    }

    GetAffectedLocalityList = (localityList) => {

        let affected = {};
        this.props.events.forEach(event => {

            let severityColor = this.props.GetEventColor(event.severity);
            Object.entries(event.localityList).forEach(([region, localities]) => {

                localityList.forEach(locality => {
                    if (localities.some(obj => obj.cisorp === locality.cisorp)) {
                        if (!affected.hasOwnProperty(severityColor))
                            affected[severityColor] = [];
                        affected[severityColor].push(locality);
                    }
                })
            })
        })

        // remove less severe duplicate localities
        affected = this.helper.RemoveLessSevereLocality(affected, "red");
        affected = this.helper.RemoveLessSevereLocality(affected, "orange");
        affected = this.helper.RemoveLessSevereLocality(affected, "yellow");

        return affected;
    }

    EventsContainSeverity = (severityColor) => {

        let contains = false;

        this.props.events.forEach(event => {

            let color = this.props.GetEventColor(event.severity);
            if (color == severityColor)
                contains = true;
        })

        return contains;
    }
    
    render() {
        return (
            this.helper.Render()
        );
    }
}
