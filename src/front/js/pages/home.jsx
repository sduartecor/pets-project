import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Map } from "../component/map.jsx";

export const Home = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
        actions.getPets();
    }, []);

	return (
		<>
		<Map/>
		</>
	);
};
