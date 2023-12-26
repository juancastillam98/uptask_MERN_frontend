import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {clienteAxios} from "../clienteAxios.js";
import {Alerta} from "../../components/Alerta.jsx";
export const ConfirmarCuenta = () => {
    const params = useParams();
    const [alerta, setAlerta] = useState({})
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
    const {token}=params
    useEffect(()=>{
        const confirmarCuenta = async () => {
            try {
                const url = `/usuarios/confirmar/${token}`;
                const {data} = await clienteAxios(url);
                setAlerta({
                    msg: data.message,
                    error: false
                })
                setCuentaConfirmada(true)
            }catch (error){
                setAlerta({
                    msg: error.response.data.message,
                    error: true
                })
            }
        }
        confirmarCuenta()
    }, [])
    const {msg}=alerta;
    console.log(cuentaConfirmada)

    return (

        <>
            <h1 className={"text-sky-600 font-black text-6xl capitalize"}>Confirma tu cuenta y comienza a crear tus &nbsp;
                <span className={"text-slate-700"}>proyectos</span>
            </h1>
            <div className={"mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white"}>

                {msg && <Alerta alerta={alerta}/>}
                {cuentaConfirmada && (
                    <Link
                        className={"block text-center my-5 text-slate-500 uppercase text-sm"}
                        to={"/"}>Inicia Sesión
                    </Link>
                )}
            </div>
        </>
    )
}