import {FormularioColaborador} from "../../components/FormularioColaborador.jsx";
import {useEffect} from "react";
import {useProyectos} from "../../hooks/useProyectos.js";
import {useParams} from "react-router-dom";
import {Alerta} from "../../components/Alerta.jsx";
export const NuevoColaborador = () => {
    //este useEffect lo utilizamos para mostrar en qué proyecto estamos
    const params = useParams();
    const {obtenerProyecto, proyecto, cargando, colaborador, agregarColaboradores, alerta} = useProyectos();
    useEffect(() => {
        obtenerProyecto(params.id)//obtengo el proyecto a partir del id
    }, [])

    if (!proyecto?._id) return <Alerta alerta={alerta}/>


    return (
        <>
            <h1 className={"text-4xl font-bold"}>Añadir Colaborador al proyecto {proyecto.nombre}</h1>
            <div className={"mt-10 flex justify-center"}>
                <FormularioColaborador/>
            </div>
            {cargando ? <p className='text-center'> Cargando... </p> : colaborador?._id && (
                <div className={"flex justify-center mt-10"}>
                    <div className={"bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full"}>
                        <h2 className={"text-center mb-10 text-2xl font-bold "}>Resultado</h2>
                        <div className={"flex justify-between items-center"}>
                            <p>{colaborador.nombre}</p>
                            <button
                                type={"button"}
                                className={"bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm hover:cursor-pointer hover:bg-black"}
                                onClick={()=>agregarColaboradores({
                                    email: colaborador.email
                                })}
                            >
                                Agregar al proyecto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}