import {useContext} from "react";
import {ProyectoContext} from "../context/ProyectosProvider.jsx";
export const useProyectos =()=>{
    return useContext(ProyectoContext)
}