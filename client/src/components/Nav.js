import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";

const Nav = ({ account }) => {
    return (
        <nav className="navbar navbar-toggleable-md navbar-light bg-light">
            <div className="container">
                <span className="navbar-brand">Raffle</span>
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/admin">Admin</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav mr-auto">
                    <li className="nav-item disabled">
                    <span>{account}</span>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;
