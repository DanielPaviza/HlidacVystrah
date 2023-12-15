import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { alerts: [], loading: true, truncatedDescription: "" };
    }

    componentDidMount() {
        this.GetAlerts();
    }

    static renderAlertsTable(alerts) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Language</th>
                        <th>Event type</th>
                        <th>Severity</th>
                        <th>Certainity</th>
                        <th>Onset</th>
                        <th>Expires</th>
                        <th>Description</th>
                        <th>Instruction</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map(a =>
                        <tr key={Math.random()}>
                            <td>{a.language}</td>
                            <td>{a.eventType}</td>
                            <td>{a.severity}</td>
                            <td>{a.certainity}</td>
                            <td>{a.onset}</td>
                            <td>{a.expires}</td>
                            <td>{a.description}</td>
                            <td>{a.instruction.substring(0, 50) + "..."}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderAlertsTable(this.state.alerts);

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async GetAlerts() {
        const response = await fetch('api/alerts/cs');
        const data = await response.json();

        console.log(data);

        if(data.responseCode == 200)
            this.setState({ alerts: data.alerts, loading: false });
    }
}
