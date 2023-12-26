import {Outlet, Navigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.js";
import {Header} from "../../components/Header.jsx";
import {Sidebar} from "../../components/Sidebar.jsx";

export const RutaProtegida = () => {
    const {auth, cargando} = useAuth();
    if (cargando) return "Cargando..."
    return (
        <>
            {auth._id ? (
                <div className={"bg-gray-100 "}>
                    <Header />
                    <div className={"md:flex md:min-h-screen"}>
                        <Sidebar/>
                        <main className={"p-10 flex-1 bg-gray-100"}>
                            <Outlet/>
                        </main>
                    </div>
                </div>
            ) : <Navigate to={"/"} />}
        </>
    )
}