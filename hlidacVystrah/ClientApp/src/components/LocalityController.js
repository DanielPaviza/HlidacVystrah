
import React from 'react';
import { useParams } from 'react-router-dom';
import { HomeController } from './HomeController';

function LocalityController(props) {

    const { cisorp } = useParams();

    return (
        <HomeController isLocalityForce={true} cisorp={cisorp} />
    );
}

export default LocalityController;