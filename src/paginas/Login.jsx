import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {clienteAxios} from "../clienteAxios.js";
import {Alerta} from "../../components/Alerta.jsx";
import {useAuth} from "../../hooks/useAuth.js";

export const Login = () => {
    
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [alerta, setAlerta]=useState({});
    const {setAuth}=useAuth();
    const navigate = useNavigate();
    const handleSubmit = async e =>{
        e.preventDefault();
        if ([email, password].includes("")){
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            })
            return;
        }

        try {

            const {data}=await clienteAxios.post("/usuarios/login", {email, password});
            setAlerta({})
            localStorage.setItem("token", data.token)
            setAuth(data)//le pasamos los datos por el provider, quien llamará a perfil para comprobar si existe el user
            navigate("/proyectos")
        }catch (error){
            setAlerta({
                msg: error.response.data.message,
                error: true,
            })
        }
    }

    const {msg }=alerta;

    return (
        <>
            <h1 className={"text-sky-600 font-black text-6xl capitalize"}>Inicia sesión y administra tus proyectos &nbsp;
                <span className={"text-slate-700"}>proyectos</span>
            </h1>
            {msg && <Alerta alerta={alerta}/> }
            <form
                className={"my-10 bg-white shadow rounded-lg p-10"}
                onSubmit={handleSubmit}
            >
                <div className={"my-5"}>
                    <label
                        className={"uppercase text-gray-600 block text-xl font-fold"}
                        htmlFor={"email"}
                    >Email</label>
                    <input
                        id={"email"}
                        type="email"
                        placeholder={"Email de Registro"}
                        className={"w-full mt-3 p-3 border rounded-xl bg-gray-50"}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className={"my-5"}>
                    <label
                        className={"uppercase text-gray-600 block text-xl font-fold"}
                        htmlFor={"password"}
                    >Password</label>
                    <input
                        id={"password"}
                        type="password"
                        placeholder={"Password de Registro"}
                        className={"w-full mt-3 p-3 border rounded-xl bg-gray-50"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <input type={"submit"}  value={"Iniciar Sesión"}
                       className={"bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors"}/>

            </form>
            <nav className={"lg:flex lg:justify-between"}>
                <Link
                    className={"block text-center my-5 text-slate-500 uppercase text-sm"}
                    to={"registrar"}>¿Aún no tienes cuenta? Regístrate
                </Link>
                <Link
                    className={"block text-center my-5 text-slate-500 uppercase text-sm"}
                    to={"/olvide-password"}>Olvidé mi password
                </Link>
            </nav>
        </>
    )
}