import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link  } from "react-router-dom";
import PropTypes from "prop-types";

export const Register = () => {
    return (
        <>
        <div className="container sizeAuto d-flex align-items-center ">
        <div className="w-50 h-100 my-5 mx-auto text-center card shadow-lg rounded">
            <div className="mx-auto w-75 my-3">
                <div className="m-1">
                <i className="fa-solid fa-users-line" style={{fontSize: "100px"}}></i>
                </div>
            <div className="fw-bold fs-4">Para crear tu cuenta necesitamos validar tus datos</div>
            <div>Solo te tomará unos minutos.</div>
            </div>
            {/*  */}
            <div className="m-1">
            <Link to="/register/personal">
            <button type="button" className="btn btn-primary  w-50 btn-lg fw-bolder"> 
            Crear cuenta personal
            </button>
            </Link>
            </div>
            {/*  */}
            <div className="m-1 mb-3">
            <Link to="/register/refuge">
            <button type="button" className="btn btn-outline-primary w-50 btn-lg fw-bolder">  
            Crear cuenta refugio
            </button>
            </Link>
            </div>
            </div>
        </div>
        </>
    )
}

