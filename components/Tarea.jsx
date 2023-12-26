import {formatearFecha} from "../helpers/helpers.js";
import {useProyectos} from "../hooks/useProyectos.js";
import {useAdmin} from "../hooks/useAdmin.js";
export const Tarea = ({tarea}) => {
    const {handleModalEditarTarea, handleModalEliminarTarea, completarTareas}=useProyectos();
    const {descripcion, nombre, prioridad, fechaEntrega, estado, _id}=tarea

    const admin = useAdmin()
    return (
        <div className={"border-b p-5 flex justify-between items-center"}>
            <div className={"flex flex-col items-start"}>
                <p className={"mb-1 text-xl"}>{nombre}</p>
                <p className={"mb-1 text-sm text-gray-500"}>{descripcion}</p>
                <p className={"mb-1 text-sm"}>{formatearFecha(fechaEntrega)}</p>
                <p className={"text-xl text-gray-600"}>Prioridad: {prioridad}</p>
                {estado &&
                    <p className={"text-xs bg-green-600 uppercase p-1 rounded-lg text-white"}>
                        Completada por: {tarea.completado.nombre}
                    </p>
                }
            </div>
            <div className={"flex flex-col lg:flex-row gap-2"}>
                {admin && (
                    <button
                        className={"text-white bg-indigo-600 px-4 py-3 uppercase font-bold rounded-lg"}
                        onClick={()=>handleModalEditarTarea(tarea)}
                    >Editar
                    </button>
                )}

                <button
                    className={`${estado ? "bg-green-600" : "bg-gray-600"} text-white  px-4 py-3 uppercase font-bold rounded-lg`}
                    onClick={()=>completarTareas(_id)}
                >{estado ? "Completa" : "Incompleta"}</button>


                {admin && (
                    <button
                        className={"text-white bg-red-600 px-4 py-3 uppercase font-bold rounded-lg"}
                        onClick={()=>handleModalEliminarTarea(tarea)}
                    >Eliminar</button>
                )}

            </div>
        </div>
    )
}