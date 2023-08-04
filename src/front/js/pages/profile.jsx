import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/home.css";
import Swal from "sweetalert2";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  //
  const [firstname, setFirstname] = useState(store.profile.firstname);
  const [lastname, setLastname] = useState(store.profile.lastname);
  const [email, setEmail] = useState(store.profile.email);
  const [contact, setContact] = useState(store.profile.contact);
  //
  useEffect(() => {
    window.scrollTo(0, 0);
    actions.getOneUser(store.profile.id);
  }, []);

  //

  //
  function deleteUser() {
    Swal.fire({
      title: "¿Estás seguro/a?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        actions.deleteUser(store.oneUser.id); // borramos el usuario
        navigate("/"); //usamos navigate para redireccionar
      }
    });
  }
  return (
    <div className="container-fluid sizeAuto d-flex align-items-center">
      {store.auth === false ? (
        <Navigate to="/" />
      ) : (
        <div className="jumbotron m-3 mx-auto w-75">
          <div className="shadow-lg rounded card">
            <div className="card-header">
              <h3 className="card-title text-center">Perfil del Usuario</h3>
            </div>
            {/* TITULO */}
            <div className="container w-75 mx-auto my-3 ">
              <div className="row g-0">
                <form>
                  <div className="form-group row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstname" className="form-label">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={store.profile.firstname}
                        id="firstname"
                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]*$"
                        title="Solo se permiten letras"
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastname" className="form-label">
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={store.profile.lastname}
                        id="lastname"
                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]*$"
                        title="Solo se permiten letras"
                        required
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={store.profile.email}
                        id="email"
                        aria-describedby="emailHelp"
                        readOnly
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="contact" className="form-label">
                        Contacto
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={store.profile.contact}
                        id="contact"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="d-grid gap-2 col-4 mx-auto mb-4">
                      <Link
                        to={"/perfil/edit"}
                        type="button"
                        className="btn btn-primary"
                      >
                        Modificar datos
                      </Link>
                    </div>

                    <div className="d-grid gap-2 col-4 mx-auto mb-4">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={deleteUser}
                      >
                        Eliminar cuenta
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* Segunda Columna */}

              {store.petsUser != null ? (
                <div className="row g-0 scrollablePerfil ">
                  <div className="col-md-12 ">
                    <div className="d-flex">
                      {store.petsUser.map((item, id) => (
                        <div className="btn m-3 ms-0 rounded " key={id}>
                          <div
                            className="card listPerfil border-primary "
                            style={{ width: "10rem", height: "10rem" }}
                          >
                            <Link
                              style={{ textDecoration: "none" }}
                              to={"/mascota/" + item.id}
                            >
                              <div className="border-bottom border-primary">
                                <img
                                  src={item.url}
                                  className="card-img-top"
                                  alt="..."
                                />
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/*  */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  match: PropTypes.object,
};
