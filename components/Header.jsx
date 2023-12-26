
import {Link} from "react-router-dom";
import {useProyectos} from "../hooks/useProyectos.js";
import {useAuth} from "../hooks/useAuth.js";
import Busqueda from "./Busqueda.jsx";

export const Header = () => {
    const {handleBuscador, cerrarSesionProyectos}=useProyectos()
    const {cerrarSesionAuth}=useAuth();
    const handleCerrarSesion = ()=>{
        cerrarSesionAuth();
        cerrarSesionProyectos()
        localStorage.removeItem("token")
    }

    return (
        <header className="p-5 bg-white border-b">
            <div className={"md:flex md:justify-between"}>
                <h2 className={"text-4xl text-sky-600 font-black text-center mb-5 md:mb-0"}>Uptask</h2>
                <div className={"flex flex-col md:flex-row items-center gap-4"} style={{ alignItems: 'center', gap: '16px' }}>
                    <button
                        type={"button"}
                        className={"font-bold uppercase"}
                        onClick={handleBuscador}
                    >
                        Buscar proyecto
                    </button>

                    <Link to={"/proyectos"} className={"font-bold uppercase"}>Proyectos</Link>
                    <button
                        type={"button"}
                        className={"text-white bg-sky-700 p-3 rounded-lg uppercase font-bold text-sm"}
                        onClick={handleCerrarSesion}
                    >Cerrar Sesión</button>
                    <Busqueda/>
                </div>
            </div>
        </header>
    )
}