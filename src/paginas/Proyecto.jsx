import {useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {useProyectos} from "../../hooks/useProyectos.js";

import {ModalFormularioTarea} from "../../components/ModalFormularioTarea.jsx";
import {ModalEliminarTarea} from "../../components/ModalEliminarTarea.jsx";
import {Tarea} from "../../components/Tarea.jsx";
import {Alerta} from "../../components/Alerta.jsx";
import {Colaborador} from "../../components/Colaborador.jsx";
import {ModalEliminarColaborador} from "../../components/ModalEliminarColaborador.jsx";

import {useAdmin} from "../../hooks/useAdmin.js";
import io from "socket.io-client";

let socket;
export const Proyecto = () => {
    const params = useParams();
    const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea} = useProyectos()
    const admin = useAdmin();

    const {id}=params;
    useEffect(()=>{
        obtenerProyecto(id)
    }, [])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit("abrir proyecto", params.id)// le paso como parámetro el id del proyecto en el que estoy
    },[])



    useEffect(()=>{
        console.log("respuesta colaborador")
        socket.on("tarea agregada", tareaNueva => {
            //estamos abriendo diferentes sockets, pero tenemos que identificar qué socket debemos actualizar
            if (tareaNueva.proyecto === proyecto._id){
                submitTareasProyecto(tareaNueva)
            }
        })
        socket.on("tarea eliminada", tareaEliminada=> {
            if (tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        socket.on("tarea actualizada", tareaActualizada=> {
            if (tareaActualizada.proyecto._id === proyecto._id){
                actualizarTareaProyecto(tareaActualizada)
            }
        })
        socket.on("nuevo estado", nuevoEstadoTarea=> {
            if (nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })



    const {nombre}=proyecto;
    const {msg}=alerta;
    return (
        cargando ? (
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                {/* ... Código del skeleton loader */}
            </div>
            ) : (
                <>
                    <div className={"flex justify-between gap-2"}>
                        <h1 className={"font-black text-4xl"}>{nombre}</h1>
                        {admin && (
                            <div className={"flex items-center gap-1"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <Link
                                    to={`/proyectos/editar/${id}`}
                                    className={"uppercase font-bold hover:text-black text-gray-600"}
                                >
                                    Editar
                                </Link>
                            </div>
                        )}
                    </div>

                    {admin && (
                        <button
                            onClick={handleModalTarea}
                            type={"button"}
                            className={"text-sm px-5 py-3 w-full md:w-auto rounded-lg font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                            Nueva Tarea
                        </button>
                    )}

                    <p className={"font-bold text-xl mt-10"}>Tareas del Proyecto</p>
                    <div className={"flex justify-center"}>
                        <div className={"w-full md:w-1/3 mg:w-1/4"}>

                        {msg && <Alerta alerta={alerta}/>}
                        </div>
                    </div>
                    <div className={"bg-white shadow my-10 rounded-lg"}>
                        {proyecto.tareas?.length ?
                            proyecto.tareas?.map(tarea =>(
                                <Tarea
                                    key={tarea._id}
                                    tarea={tarea}
                                />
                            )) :
                            <p className={"text-center my-5 p-10"}>No hay tareas en este proyecto</p>}
                    </div>

                    {admin && (
                        <>
                            <div className={"flex items-center justify-between mt-10"}>
                                <p className={"font-bold text-xl"}>Colaboradores</p>
                                <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                      className={"text-gray-400 uppercase font-bold hover:text-black hover:cursor:pointer"}
                                >
                                    Añadir
                                </Link>
                            </div>
                            <div className={"bg-white shadow my-10 rounded-lg"}>
                                {proyecto.colaboradores?.length ?
                                    proyecto.colaboradores?.map(colaborador =>(
                                        <Colaborador
                                            key={colaborador._id}
                                            colaborador={colaborador}
                                        />
                                    )) :
                                    <p className={"text-center my-5 p-10"}>No hay Colaboradores en este proyecto</p>}
                            </div>
                        </>

                    )}


                    <ModalFormularioTarea/>
                    <ModalEliminarTarea/>
                    <ModalEliminarColaborador/>
                </>

        )
    );
}


