import axios from 'axios';
import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			auth: false,
			profile: {},
			pets: [],
			onePet: {},

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			login: async (email, password) => {
				try {
				  const response = await axios.post(process.env.BACKEND_URL + '/api/login', {email: email,
					password: password,
					 },
					 {
					   headers: {
						 "Access-Control-Allow-Origin": "*",
					   },
					 }
					 );
					if (response.data.user != null){
				 setStore({
					auth: true,
					profile: response.data.user
				 })
				}
				  // Guarda el token en local storage segun los datos del fetch
				  console.log(response.data);
				  localStorage.setItem("token", response.data.msg);
				} catch (error) {
				    if (error.response.status === 404) {
						Swal.fire({
						  icon: "error",
						  title: "Oops...",
						  confirmButtonColor: "#000000",
						  text: error.response.data.msg + "... redirecting to signup...",
						});
						return error.response.data.msg;
					  } else if (error.response.data.msg === "Bad email or password") {
						Swal.fire({
						  icon: "error",
						  title: "Oops...",
						  text: error.response.data.msg,
						});
						return error.response.data;
					  }
				}
			  },
			  register: async (email, password, contact,firstname,lastname) => {
				try {
				  const response = await axios.post(
					process.env.BACKEND_URL + "/api/register",
					{
					  email: email,
					  password: password,
					  contact: contact,
					  firstname: firstname,
					  lastname: lastname,
					  admin: false,
					},
					{
					  headers: {
						"Access-Control-Allow-Origin": "*",
					  },
					}
				  );
		
				  if (response.data.msg === "New user created") {
					getActions().login(email, password);
					// Setea store para declarar al usuario como registrado
					setStore({
					  auth: true,
					});
				  }
				  return response.data.msg;
				} catch (error) {
				  // Si usuario exitste
				  if (error.response.data.msg === "User exists") {
					// swal(error.response.data.msg);
					return error.response.data.msg;
				  }
				}
			  },
			  validToken: async () => {
                let accessToken = localStorage.getItem("token");
                try {
                    const response = await axios.get(
                        process.env.BACKEND_URL + "/api/valid-token", {
                            headers: {
                                Authorization: "Bearer " + accessToken,
								'Access-Control-Allow-Origin': '*'
                            },
                        }
                    );
                    if (response.data.user != null) {
                        setStore({
                            auth: true,
                            profile: response.data.user,
                        });
                    }

                    return;
                } catch (e) {
                    if (e.response.status === 402 || e.response.status === 404) {
                        setStore({
                            auth: false,
                        });
                    }
                    return false;
                }
            },
			logout: () => {
                localStorage.removeItem("token");
                setStore({
                    auth: false,
                });
            },
			getPets: async () => {
				try {
                    const response = await axios.get(
                        process.env.BACKEND_URL + "/api/pets", {
                            headers: {
								'Access-Control-Allow-Origin': '*'
                            },
                        }
                    );
                    if (response.data != null) {
                        setStore({
                            pets: response.data
                        });
						
                    }
                    return;
                } catch (e) {
                    return false;
                }

			},
			petsPost: async (
                genero,
                tamaño,
                color,
                descripcion,
                edad,
                raza,
                especie,
                latitud,
                longitud,
                urlimage,
                usuario_id
            ) => {
				try {
					const response = await axios.post(
						process.env.BACKEND_URL + "/api/pets",
						{
						  genero: genero,
						  tamaño: tamaño,
						  color: color,
						  descripcion: descripcion,
						  edad: edad,
						  raza: raza,
						  especie: especie,
						  latitud: latitud,
						  longitud: longitud,
						  urlimage: urlimage,
						  usuario_id: usuario_id,
						},
						{
						  headers: {
							"Access-Control-Allow-Origin": "*",
						  },
						}
					  );
					 
					if (response.status === 200) {
						Swal.fire({
							icon: "success",
							title: "¡Bien hecho!",
							text: "Mascota publicada con éxito",
						});
					}
					
				  } catch (error) {
					if (error.response.status === 406) {
						Swal.fire({
							icon: "error",
							title: "¡Algo anduvo mal!",
							text: error.response.data.msg,
						});	
					}
				  }

			},
			
			getOnePet: async (id) => {
				let store = getStore();
				try {
				  const response = await fetch(
					process.env.BACKEND_URL + "/api/pets/" + id
				  );
				  const data = await response.json();
				  setStore({
					onePet: data
				  });
				  return store.onePet;
				} catch (err) {
				  console.log(err);
				}
			  },
			  
			uploadImage: async (image) => {
				try {
					const data = new FormData();
					data.append("file", image);
					data.append("upload_preset", "findspetsImage");
			
					const response = await axios.post(
						"https://api.cloudinary.com/v1_1/imagepets/image/upload",
						data,
						{
							headers: {
								"Content-Type": "multipart/form-data"
							}
						}
					);
			
					return response.data.url;
				} catch (e) {
					return false;
				}
				
			},
		
			

			
		}
	};
};

export default getState;
