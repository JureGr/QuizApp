import React from 'react';
import { Spin } from 'antd';
import './Spinner.css';

const Spinner = () => (
    <div className="spinner">
        <Spin tip="Loading..." size="large" />
    </div>
);

export default Spinner;