import {useState, useEffect,createContext} from "react";
import {useNavigate} from "react-router-dom"; //este hook lo usaremos para que el usuario no tenga que estar todo el tiempo logueándose
import {clienteAxios} from "../src/clienteAxios.js";
export const AuthContext=createContext();

export default function AuthProvider({children}){

    const [auth, setAuth]=useState({})
    const [cargando, setCargando]=useState(true)
    const navigate=useNavigate()
    //solo se va a ejecutar 1 sola vez, para comprobar que existe el usuario
    useEffect(()=>{
        const autenticarUsuario = async ()=>{
            const token = localStorage.getItem("token")
            if (!token){
                setCargando(false)
                return
            }
            const config={
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            try{
                const {data}=await clienteAxios("/usuarios/perfil", config)//le pasamos el Bearer token
                setAuth(data)
                //navigate("/proyectos")//si el usuario se ha logueado correctamente, lo redirigimos a proyectos
            }catch (error){
                setAuth({})//si hay algo previamente, pongo vacío
            }finally {
                setCargando(false)
            }
        }
        autenticarUsuario();
    },[])

    //cerrar sesión auth
    const cerrarSesionAuth=()=>{
        setAuth({})
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}