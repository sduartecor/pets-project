  import React, { useState, useEffect, useContext } from "react";
  import { Context } from "../store/appContext";
  import { Link, useParams  } from "react-router-dom";
  import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export const PetLost = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    useEffect(() => {
      window.scrollTo(0, 0);
      async function fetchPet() {
        const response = await actions.getOnePet(params.id);
        if (response) {
          setLat(store.onePet.latitud);
          setLng(store.onePet.longitud);
          console.log(store.onePet);
        }
      }
      fetchPet();
    }, [params.id]);

    var blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

      return (
          <div className="container-fluid">
          <div className="jumbotron m-3  shadow-sm rounded">
            
              <div className="row g-0">
                <div className="col-md-6 card">
                <div className="card-header d-flex justify-content-between">
            <h3>INFORMACIÓN DE LA MASCOTA</h3>
               {/* Boton Modificar */}
               <div className="">
               {store.profile.id === store.onePet.user_id &&
                  store.auth == true ? (
                    <Link
                      to={"/mascota/edit"}
                      className=" btn btn-outline-secondary"
                    >
                      <i className="fa fa-edit"></i>
                    </Link>
                  ) : null}
                  {/* Boton Eliminar */}
                  {store.profile.id === store.onePet.user_id &&
                  store.auth == true ? (
                    <button
                      className=" btn btn-outline-primary fw-semibold mx-1"
                      
                    >
                      {store.onePet.estado == "lost"
                        ? "Encontrado"
                        : "Adoptado"}
                      <i className="fa fa-smile-beam mx-1"></i>
                    </button>
                  ) : null}
                  </div>
          </div>
                  {/*  */}

              <div className="card-body">
                  <div id="carouselExample" className="carousel slide imageSize">
                      <div className="carousel-inner">
                              {store.onePet.url ? (
                              store.onePet.url.map((item, id) => (
                                <div key={id} className={"carousel-item " + (id == 0 ? " active" : "")}    >
                                  <img src={item} className="imageSize" />
                                </div>
                                
                              ))
                            ) : null}
                </div>
                
                {store.onePet.url && store.onePet.url.length > 1 && (
              <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                  </button>
              </>
          )}

            </div>

        </div>



                  {/*  */}
                </div>
                {/* Mapa */}
                <div className="col-md-6 card">
                  {store.onePet.latitud ?  <MapContainer center={[lat,lng]} zoom={17} scrollWheelZoom={true} className="map" >
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {lat && lng && <Marker position={[lat, lng]} icon={blueIcon}/>}     
          </MapContainer> : null }
              
                </div>
              </div>
          
          </div>
        </div>
      )
  };