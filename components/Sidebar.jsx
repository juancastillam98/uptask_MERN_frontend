import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";
export const Sidebar = () => {
    const {auth} = useAuth();
    return (
        <aside className={"md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10"}
               style={{width: "24rem"}}
        >
            <p className={"text-xl font-bold"}>Hola: {auth.nombre}</p>
            <Link
                to={"crear-proyecto"}
                className={"bg-sky-700 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg"}
            >Nuevo Proyecto</Link>
        </aside>
    )
}