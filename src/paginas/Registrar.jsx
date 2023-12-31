import {Link} from "react-router-dom";
import {useState} from "react";
import {Alerta} from "../../components/Alerta.jsx";
import {clienteAxios} from "../clienteAxios.js";

export const Registrar = () => {
    const [nombre, setNombre]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [repetirPassword , setRepetirPassword]=useState("")
    const [alerta, setAlerta]=useState({});

    const handleSubmit = async e => {
        e.preventDefault();
        if ([nombre, email, password, repetirPassword].includes("")) {
            setAlerta({
                "msg": " Todos los campos son obligatorios",
                "error": true
            })
            return
        }
        if (password !== repetirPassword) {
            setAlerta({
                "msg": "Los passwords no son iguales",
                "error": true
            })
        }
        if (password.length < 6) {
            setAlerta({
                "msg": "El password es muy corto",
                "error": true
            })
        }

        //Crear el usuario en la api
        try {
            const {data} = await clienteAxios.post(`/usuarios`,
                {
                        nombre,
                        email,
                        password
                    }
                )
            setAlerta({
                msg: data.msg,
                error: false
            })
            setNombre("");
            setEmail("")
            setPassword("")
            setRepetirPassword("")
        } catch (error) {
            //console.log()
            setAlerta({
                msg: error.response.data.message,
                error: true
            })
        }

    }
    const {msg} = alerta;

    return (
        <>
            <h1 className={"text-sky-600 font-black text-6xl capitalize"}>ICrea tu cuenta y administra tus proyectos &nbsp;
                <span className={"text-slate-700"}>proyectos</span>
            </h1>

            <form className={"my-10 bg-white shadow rounded-lg p-10"}
                  onSubmit={handleSubmit}
            >
                {msg && <Alerta alerta={alerta}/> }

                <div className={"my-5"}>
                    <label
                        className={"uppercase text-gray-600 block text-xl font-bold"}
                        htmlFor={"nombre"}
                    >Nombre</label>
                    <input
                        id={"nombre"}
                        type="text"
                        placeholder={"Tu nombre"}
                        className={"w-full mt-3 p-3 border rounded-xl bg-gray-50"}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>
                <div className={"my-5"}>
                    <label
                        className={"uppercase text-gray-600 block text-xl font-bold"}
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
                        className={"uppercase text-gray-600 block text-xl font-bold"}
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
                <div className={"my-5"}>
                    <label
                        className={"uppercase text-gray-600 block text-xl font-bold"}
                        htmlFor={"password2"}
                    >Repetir password</label>
                    <input
                        id={"password2"}
                        type="password"
                        placeholder={"Password de Registro"}
                        className={"w-full mt-3 p-3 border rounded-xl bg-gray-50"}
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>
                <input type={"submit"}  value={"Crear Cuenta"}
                       className={"bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors"}
                />
            </form>
            <nav className={"lg:flex lg:justify-between"}>
                <Link
                    className={"block text-center my-5 text-slate-500 uppercase text-sm"}
                    to={"/"}>¿Ya tienes una cuenta? Inicia Sesión
                </Link>
                <Link
                    className={"block text-center my-5 text-slate-500 uppercase text-sm"}
                    to={"/olvide-password"}>Olvidé mi password
                </Link>
            </nav>
        </>
    )
}