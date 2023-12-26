import {useEffect} from "react";
import {useProyectos} from "../../hooks/useProyectos.js";
import {PreviewProyecto} from "../../components/PreviewProyecto.jsx";
import {Alerta} from "../../components/Alerta.jsx";
import io from "socket.io-client"

let socket;
export const Proyectos = () => {

    const {proyectos, alerta} = useProyectos()

    useEffect(()=>{
        //abrimos una nuevo conexión con el servidor
        socket = io(import.meta.env.VITE_BACKEND_URL)
        /*
        //emit emite un evento a un socket identificado por el nombre de un string.
        socket.emit("prueba", "nombre") //le envío un mensaje/paquete llamado prueba
        socket.on("respuesta", (persona)=>{//con .on, indico que recibo. En este caso recibo respuesta
            console.log("Desde el frontend ",persona)
        });
        */

    })

    const {msg}=alerta;

    return (
        <>
            <h1 className={"text-4xl font-black"}>Proyectos</h1>
            {msg && <Alerta alerta={alerta}/>}
            <div className={"bg-white shadow mt-10 rounded-lg"}>
                {proyectos.length ?
                    proyectos.map(proyecto =>(
                        <PreviewProyecto
                            key={proyecto._id}
                            proyecto={proyecto}
                        />
                    ))
                    : <p className={"text-center text-gray-600 uppercase p-5"}>No hay proyectos</p>}
            </div>
        </>
    )
}