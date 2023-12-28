
import React from 'react';
import { ReactComponent as Img } from '../map.svg';

class MapHelper {

    constructor() {
        this.svgRef = React.createRef();
    }

    Render() {
        return (
            <div id="map" className='d-flex justify-content-center mx-auto'>
                <Img ref={this.svgRef} className='col-12 col-lg-10 col-xl-8'/>
            </div>
        );
    }

    FlattenAffected = (list) => {
        // The list arrays have 1 less depth
        Object.keys(list).forEach(key => {
            list[key] = list[key].flat();
        })

        return list;
    }

    RemoveLessSevereLocality = (cisorpList, localitySeverityKey) => {

        let currentSeverityList = cisorpList[localitySeverityKey];
        if (currentSeverityList == undefined)
            return cisorpList;

        let reduced = {};

        Object.keys(cisorpList).forEach(key => {

            if (key != localitySeverityKey) {

                cisorpList[key].forEach(locality => {

                    let addLocality = true;
                    currentSeverityList.forEach(u => {
                        if (u.cisorp == locality.cisorp) {
                            addLocality = false;
                            return;
                        }
                    })

                    if (addLocality) {
                        if (!reduced.hasOwnProperty(key))
                            reduced[key] = [];
                        reduced[key].push(locality);
                    }

                })
            }
        })

        reduced[localitySeverityKey] = currentSeverityList;

        return reduced;
    }

    RenderLocalityColor = (affected) => {

        const mapLocalityList = Array.from(this.svgRef.current.childNodes[0].childNodes);

        // add attributes to all locations
        mapLocalityList.forEach(g => {
            let id = g.attributes.getNamedItem("cisorp").value;
            g.setAttribute("onClick", `this.HandleMapClick(${id})`);
        })

        Object.entries(affected).forEach(([severityColor, localities]) => {
            localities.forEach((locality) => {

                const foundElement = mapLocalityList.find(element => {
                    const cisorpAttribute = element.attributes.getNamedItem("cisorp");

                    return cisorpAttribute && cisorpAttribute.value == locality.cisorp;
                });

                //foundElement.setAttribute("fill", severityColor);
                foundElement.setAttribute("class", severityColor);
            });
        });
    }

    HandleMapClick = (id) => {
        console.log("fefe")
        //this.props.OpenLocalityDetail(id);
    }
}

export default MapHelper;