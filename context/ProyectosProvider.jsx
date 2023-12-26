import {useState, useEffect, createContext} from "react";
import {clienteAxios} from "../src/clienteAxios.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";
import io from "socket.io-client"

let socket;
export const ProyectoContext = createContext();
export default function ProyectosProvider({children}){
    const [proyectos, setProyectos] =useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate= useNavigate();
    const auth= useAuth();

    //La finalidad de este useEffect es extraaer los datos de la bd
    useEffect(()=>{
        const obtenerProyectos = async ()=>{
            try {
                const token = localStorage.getItem('token')
                if (!token) return;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const {data}= await clienteAxios("/proyectos", config)
                setProyectos(data)
            }catch (error) {
                console.error(error)
            }
        }
        obtenerProyectos()
    }, [auth])
    //UseEffect encargado de abrir una conexión con el servidor
    useEffect(()=>{
        socket=io(import.meta.env.VITE_BACKEND_URL);
    })
    const mostrarAlerta = alerta =>{
        setAlerta(alerta)
        setTimeout(()=>{
            setAlerta({})
        }, 5000)
    }
    //Pasar los datos hacia el provider
    const submitProyecto = async proyecto=>{
        if (proyecto.id){//este id es el que le pasamos si estamos editando
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
    }
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)//Almacenamos en el array los proyectos actualizados

            setAlerta({
                "msg": "Proyecto actualizado correctamente",
                error: false
            })
            setTimeout(()=>{
                setAlerta({})
                navigate("/proyectos")
            }, 3000)

        } catch (error) {
            console.error(error)
        }
    }
    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post("/proyectos", proyecto, config)
            setProyectos([...proyectos, data]);//para mostrar los proyectos, en vez de consultarlos de la bd donde tendríamos que recargar la página,
            //Podemos hacer una copia del array de proyectos que se insertan y consultarla. LO que hacemos es hacer una copia del array de proyectos, al que le añadimos
            //a ese array un proyecto antes de insertarlo en la bd. Ese array es el que nos recorremos luego en Proyectos
            setAlerta({
                "msg": "Proyecto creado correctamente",
                error: false
            })
            setTimeout(()=>{
                setAlerta({})
                navigate("/proyectos")
            }, 3000)
        }catch (error) {
            console.error(error);
        }
    }
    const obtenerProyecto=async id =>{
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        }catch (error) {
            navigate("/")
            setAlerta({})
        }finally {
            setCargando(false)
        }
    }
    const eliminarProyecto= async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(()=>{
                setAlerta({})
                navigate("/proyectos")
            }, 3000)
            //setProyecto(data)
        }catch (error) {
            console.error(error);
        }finally {
            setCargando(false)
        }
    }

    const handleModalTarea = ()=>{
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }
    //Agrega una tarea al proyecto
    const submitTarea = async (tarea)=>{

        if (tarea?.id){
           await editarTarea(tarea)
        }else{
           await crearTarea(tarea)
        }
    }
    const editarTarea = async (tarea)=>{
        console.log("desde editart tarea")
        console.log(tarea)
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            //Tareas está dentro de proyecto. O sea proyecto tiene una array de tareas, luego para actualizar las tareas del state hay que actualizar el proyecto
            setAlerta({})
            setModalFormularioTarea(false)

            //socket IO
            socket.emit("actualizar tarea", data)
        }catch (error){
            console.error(error)
        }
    }
    const crearTarea = async (tarea)=>{
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await clienteAxios.post(`/tareas`, tarea, config)

            setAlerta({})
            setModalFormularioTarea(false)

            //socket io
            socket.emit("nueva tarea", data)

        }catch (error) {
            console.error(error)
        }
    }
    const handleModalEditarTarea=tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }
    const handleModalEliminarTarea=tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }
    //eliminar alerta no requiere que le pasemos alerta porque la está cogiendo del state
    const eliminarTarea= async  ()=> {
        console.log(tarea)//recuerda que lo coge del state tarea, en el handleModalEditarTarea se la hemos establecido
        //funciona bien
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //console.log("Contenido de data ", tarea._id)
            const {data}=await clienteAxios.delete(`/tareas/${tarea._id}`, config)//esta tarea viene de la bd

            setModalEliminarTarea(false)

            //Socket
            socket.emit('eliminar tarea' ,tarea)

            setTarea({})
            setAlerta({
                msg: data.msg,
                error: false
            })


            setTimeout(()=>{
                setAlerta({})
            },3000)
        }catch(error) {
            console.log(error)
        }
    }
    const completarTareas = async id=>{
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await clienteAxios.post(`tareas/estado/${id}`, {}, config)

            //socket io
            socket.emit('cambiar estado', data)

            setTarea({})
            setAlerta({})
        }catch (error) {
            console.error(error.response)
        }
    }


    const submitColaborador= async email=>{
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await clienteAxios.post("/proyectos/colaboradores", {email}, config)//le vamos a pasar el email como obj,
            // es obj porque es lo que le pasamos al body. {email: email}
            setColaborador(data)
            setAlerta({})
        }catch (error){
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }finally {
            setCargando(false)
        }
    }//busca un colaborador
    const agregarColaboradores = async email =>{
        //console.log(proyecto) recuerda que proyecto, al estar en el state, lo tenemos siempre disponible
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            console.log(data)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(()=>{
                setAlerta({})
            }, 3000)

        }catch (error){
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    const handleModalEliminarColaborador=(colaborador)=>{
        setModalEliminarColaborador(!modalEliminarColaborador);
        setColaborador(colaborador)
    }
    const eliminarColaborador= async ()=>{//al igual que con tarea, el colaborador está en el state.
        try {
            const token = localStorage.getItem('token')
            if (!token) return;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)
            console.log(data)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(()=>{
                setAlerta({})
            }, 3000)
        }catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const handleBuscador = ()=>{
        setBuscador(!buscador)//cambia de true a false y viceversa
    }

    //Socket io
    const submitTareasProyecto = (tarea)=>{
        //agregamos la tarea al state porque si recuerdas, al estar en el state se sincroniza en tiempo real
        const proyectoActualizado = {...proyecto}//copia del proyecto
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]//copia de tareas
        setProyecto(proyectoActualizado)
    }
    const eliminarTareaProyecto = tarea =>{
        const proyectoActualizado ={...proyecto}
        proyectoActualizado.tareas= proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyecto(proyectoActualizado)
    }
    const actualizarTareaProyecto = tarea =>{
        const proyectoActualizado ={...proyecto}//copia del proyecto del state (proyecto es un objeto)
        //me recorro las tareas de un proyecto y actualizo la tarea que he cambiado
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea =>{
        //actualizamos el estate del proyecto
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);//data nos trae la tarea ya actualizada
        setProyecto(proyectoActualizado)
    }

    //Cerrar sesión
    const cerrarSesionProyectos = ()=>{
        setProyectos([]);
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectoContext.Provider
            value={
            {
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                setModalEliminarTarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaboradores,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTareas,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }
        }>
            {children}
        </ProyectoContext.Provider>
    )
}
