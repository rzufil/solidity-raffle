import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";

const Nav = ({ account, admin }) => {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <span class="navbar-brand">Raffle</span>
                {admin
                    ? <ul class="navbar-nav">
                        <li class="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a className="nav-link" href="/admin">Admin</a>
                        </li>
                    </ul>
                    : <></>}
                <span class="navbar-text mr-auto">
                    {account}
                </span>
            </div>
        </nav>
    );
};

export default Nav;
