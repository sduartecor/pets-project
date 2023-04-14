import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from "prop-types";
import { useAsyncError, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";

function ClickHandler({ handleClick }) {
  // Utilizar el hook useMapEvents para agregar el controlador de clic al mapa
  useMapEvents({
    click: handleClick,
  });

  return null;
}

export const Lost = () => {
  const { store, actions } = useContext(Context);
  const position = [-34.839054258608684, -56.16434951021918];
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState('');
  let navigate = useNavigate();

  const lostSchema = Yup.object().shape({
    descripcion: Yup.string().required('La descripción es requerida'),
    genero: Yup.string().required('El género es requerido'),
    tamaño: Yup.string().required('El tamaño es requerido'),
    color: Yup.string().required('El color es requerido'),
    edad: Yup.string().required('La edad es requerida'),
    especie: Yup.string().required('La especie es requerida'),
    raza: Yup.string().when("especie", (especie, schema) => {
      if(especie == "perro")
        return schema.required('La raza es requerida')
      return schema
    }),
    urlimage: Yup.mixed().test('fileFormat', 'Formato de archivo no válido', (value) => {
      if (value) {
        const supportedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
        return supportedFormats.includes(value.type);
      }
      return true;
    }),
  });

    const handleSubmit = async (values) => {
      const imagenesUrl = [];
      for (let i = 0; i < images.length; i++) {
        const imagen = images[i];
        let url = await actions.uploadImage(imagen);
        imagenesUrl.push(url);
      }
    //  Fetch

    actions.petsPost(values.genero,values.tamaño,values.color,values.descripcion,values.edad,values.raza,values.especie,lat,lng,imagenesUrl,store.profile.id);
      
      
      
    };

 
    function handleImagenChange(event) {
      event.preventDefault();
      const images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        const imagen = event.target.files[i];
        images.push(imagen);
      }
      setImages(images);
    }

  var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  function handleClick(e) {
    // Obtener las coordenadas del punto donde se hizo clic
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    //
    setLat(lat);
    setLng(lng);
  }

  return (
    <div className="container-fluid">
      <div className="jumbotron m-3  shadow-sm rounded">
        
          <div className="row g-0">
            <div className="col-md-6 card">
             
              <div className="card-header">
          <h3 className="card-title  text-center">MASCOTA PERDIDA</h3>
        </div>

        <div className="card-body">
        <Formik
          initialValues={{descripcion: '',
          genero: '',
          tamaño: '',
          color: '',
          edad: '',
          especie: '',
          raza: '',
          urlimage: ''}}

          validationSchema={lostSchema}

          onSubmit={(values, {resetForm}) => {
            handleSubmit(values);
            resetForm();
            values.urlImage=null;
          }}
         
        >
          {({ errors, touched, values }) => (
            <Form>
              {/* Columna 1 */}
              <div className="form-group row">
            <div className="col-md-12 mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <Field
                as="textarea"
                className={`form-control ${errors.descripcion && touched.descripcion ? 'is-invalid' : ''}`}        
                id="descripcion"
                name="descripcion"
                rows="2"
              />
              <ErrorMessage
                name="descripcion"
                component="div"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-6 mb-3">
              <label htmlFor="genero" className="form-label">
                Género
              </label>
              <Field
                as="select"
                className={`form-select ${errors.genero && touched.genero ? 'is-invalid' : ''}`} 
                id="genero"
                name="genero"
              >
                <option value="" disabled>
                  Selecciona un género
                </option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </Field>
              <ErrorMessage
                name="genero"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="tamaño" className="form-label">
                Tamaño <b>*</b>
              </label>
              <Field
                as="select"
                className={`form-select ${errors.tamaño && touched.tamaño ? 'is-invalid' : ''}`} 
                id="tamaño"
                name="tamaño"
              >
                <option value="" disabled>
                  Selecciona un tamaño
                </option>
                <option value="chico">Chico</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </Field>
              <ErrorMessage
                name="tamaño"
                component="div"
                className="invalid-feedback"
              />
            </div>
          </div>
            {/*  */}
            <div className="form-group row">
              <div className="col-md-6 mb-3">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <Field
                  type="text"
                  className={`form-control ${errors.color && touched.color ? 'is-invalid' : ''}`} 
                  name="color"
                  id="color"
                />
                <ErrorMessage
                  component="div"
                  name="color"
                  className="invalid-feedback"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="edad" className="form-label">
                  Edad
                </label>
                <Field
                  as="select"
                  className={`form-select ${errors.edad && touched.edad ? 'is-invalid' : ''}`} 
                  name="edad"
                  id="edad"
                >
                  <option value="" disabled>
                    Selecciona una edad
                  </option>
                  <option value="cachorro">Cachorro</option>
                  <option value="joven">Joven</option>
                  <option value="anciano">Anciano</option>
                </Field>
                <ErrorMessage
                  component="div"
                  name="edad"
                  className="invalid-feedback"
                />
              </div>
            </div>
           {/*  */}
           <div className="form-group row">
            <div className="col-md-6 mb-3">
              <label htmlFor="especie" className="form-label">
                Especie
              </label>
              <Field
                as="select"
                className={`form-select ${errors.especie && touched.especie ? 'is-invalid' : ''}`} 
                name="especie"
                id="especie"
              >
                <option value="" disabled>
                  Selecciona una especie
                </option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </Field>
              <ErrorMessage name="especie" className="invalid-feedback" />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="raza" className="form-label">
                Raza
              </label>
              <Field
                type="text"
                className={`form-control ${errors.raza && touched.raza ? 'is-invalid' : ''}`} 
                name="raza"
                id="raza"
                disabled={values.especie === "gato" || values.especie == ""}
              />
              <ErrorMessage name="raza" className="invalid-feedback" />
            </div>
            </div>

          <div className="form-group row">
            <div className="col-md-12 mb-3">
              <Field type="file" name="urlimage" onChange={handleImagenChange} className={`form-control ${errors.urlImage && touched.urlImage ? 'is-invalid' : ''}`}  id="urlimage" multiple/>
              <ErrorMessage name="urlimage" className="invalid-feedback" />
            </div>
          </div>
          <div className="form-group row">
          <div className="d-grid gap-2 col-6 mx-auto">
                      <button type="submit" className="btn btn-lg btn-primary">
                        Publicar
                      </button>
                    </div>
            </div>
            
            </Form>
          )}
        </Formik>
        </div>

            </div>
            {/* Mapa */}
            <div className="col-md-6 card">
            
              
            <MapContainer center={position} zoom={11} scrollWheelZoom={true} className="map" >
      <ClickHandler handleClick={handleClick} />
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={blueIcon}/>
    </MapContainer>
            </div>
          </div>
      
      </div>
    </div>
  );
};

Lost.propTypes = {
  match: PropTypes.object,
};