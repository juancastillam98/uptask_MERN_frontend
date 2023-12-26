import {useProyectos} from "./useProyectos.js";
import {useAuth} from "./useAuth.js";

/*
este hook es para que me diga en todo momento quén es el usuario autenticado y quien el creador del proyecto.
si el creador del proyecto y el usuario autenticado es el mismo podo es el quien tendrá todos los permisos. Si no es el mismo,
no tiene los permisos para editar tareas ni agregar colaboradores
* */
export const useAdmin=()=>{
    const {proyecto} = useProyectos();
    const {auth}=useAuth();
    return proyecto.creador=== auth._id; //en este casi es el creador
}