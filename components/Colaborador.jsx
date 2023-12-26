import {useProyectos} from "../hooks/useProyectos.js";

export const Colaborador = ({colaborador}) => {
    const {handleModalEliminarColaborador}=useProyectos();
    const {nombre, email}=colaborador;
    return (
        <div className={"border-b p-5 flex justify-between"}>
            <div>
                <p>{nombre}</p>
                <p className={"text-sm text-gray-700"}>{email}</p>
            </div>
            <div className>
                <button
                    className={"bg-red-600 p-4 text-white uppercase font-bold text-sm rounded-lg"}
                    type={"button"}
                    onClick={()=>handleModalEliminarColaborador(colaborador)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}