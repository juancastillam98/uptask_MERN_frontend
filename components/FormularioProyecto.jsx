import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Alerta} from "./Alerta.jsx";
import {useProyectos} from "../hooks/useProyectos.js";
export const FormularioProyecto = () => {
    const [id, setId]=useState(null)
    const [nombre, setNombre]=useState("")
    const [descripcion, setDescripcion]=useState("")
    const [fechaEntraga, setFechaEntrega]=useState("")
    const [cliente, setCliente]=useState("")
    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos();//recuerdo, proyecto almacena la información del proyecto a través del id
    const params = useParams();

    useEffect(()=>{
        if (params.id && proyecto.nombre){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }else{
            console.log("Nuevo proyecto")
        }
    }, [params])
    const handleSubmit = async e => {
        e.preventDefault()
        if ([nombre, descripcion, fechaEntraga, cliente].includes("")) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            })
            return

        }//cuando estoy editando, el id se pasa como null
        //pasar los datos hacia el provider
        await submitProyecto({
            id,
            nombre,
            descripcion,
            fechaEntraga,
            cliente
        })
        setId(null )
        setNombre("")
        setCliente("")
        setDescripcion("")
        setFechaEntrega("")

    }
    const {msg}=alerta
    return (
        <form className={"bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"}
              onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta}/>}
            <div className={"mb-5"}>
                <label
                    className={"text-gray-700 uppercase font-bold text-sm"}
                    htmlFor={"nombre"}
                >
                    Nombre Proyecto
                </label>
                <input
                    id={"nombre"}
                    type={"text"}
                    className={"border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg"}
                    style={{border: '1px solid gainsboro', padding: '8px', marginTop: "5px" }}
                    placeholder={"Nombre del Proyecto"}
                    value={nombre}
                    onChange={e =>setNombre(e.target.value)}
                />
            </div>

            <div className={"mb-5"}>
                <label
                    className={"text-gray-700 uppercase font-bold text-sm"}
                    htmlFor={"descripcion"}
                >
                    Descripcion
                </label>
                <textarea
                    id={"descripcion"}
                    className={"border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-lg"}
                    style={{border: '1px solid gainsboro', padding: '8px', marginTop: "5px" }}
                    placeholder={"Descripcion del Proyecto"}
                    value={descripcion}
                    onChange={e =>setDescripcion(e.target.value)}
                />
            </div>

            <div className={"mb-5"}>
                <label
                    className={"text-gray-700 uppercase font-bold text-sm"}
                    htmlFor={"fecha-entrega"}
                >
                    Nombre Proyecto
                </label>
                <input
                    id={"fecha-entrega"}
                    type={"date"}
                    className={"border-2 w-full p-2 mt-2 placeholder-gray-40"}
                    style={{border: '1px solid gainsboro', padding: '8px', marginTop: "5px" }}
                    placeholder={"Nombre del Proyecto"}
                    value={fechaEntraga}
                    onChange={e =>setFechaEntrega(e.target.value)}
                />
            </div>
            <div className={"mb-5"}>
                <label
                    className={"text-gray-700 uppercase font-bold text-sm"}
                    htmlFor={"cliente"}
                >
                    Nombre Cliente
                </label>
                <input
                    id={"cliente"}
                    type={"text"}
                    className={"border-2 w-full p-2 mt-2 placeholder-gray-40 rounded-lg"}
                    style={{border: '1px solid gainsboro', padding: '8px', marginTop: "5px" }}
                    placeholder={"Nombre del Cliente"}
                    value={cliente}
                    onChange={e =>setCliente(e.target.value)}
                />
            </div>
            <input type={"submit"}  value={id ? "Actualizar Proyecto" : "Crear Nuevo Proyecto"}
                   className={"bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-lg hover:cursor-pointer hover:bg-sky-800 transition-colors"}/>
        </form>
    )
}