import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './style.css';
import AppBar from '../../components/AppBar';

export default function ImportClient() {
    const history = useHistory();


    return (
        <div>
            <AppBar />
        </div>
    );
}
