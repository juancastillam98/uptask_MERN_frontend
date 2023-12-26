import {BrowserRouter, Routes, Route} from "react-router-dom";

//components
import {AuthLayout} from "./layouts/AuthLayout.jsx";
import {Login} from "./paginas/Login.jsx";
import {Registrar} from "./paginas/Registrar.jsx";
import {NuevoPassword} from "./paginas/NuevoPassword.jsx";
import {OlvidePassword} from "./paginas/OlvidePassword.jsx";
import {ConfirmarCuenta} from "./paginas/ConfirmarCuenta.jsx";
import {RutaProtegida} from "./layouts/RutaProtegida.jsx";
import {Proyectos} from "./paginas/Proyectos.jsx";
import {NuevoProyecto} from "./paginas/NuevoProyecto.jsx";
import {Proyecto} from "./paginas/Proyecto.jsx";
import {EditarProyecto} from "./paginas/EditarProyecto.jsx";
import {NuevoColaborador} from "./paginas/NuevoColaborador.jsx";

import AuthProvider from "../context/AuthProvider.jsx";
import ProyectosProvider from "../context/ProyectosProvider.jsx";

function App() {

  return (
    <BrowserRouter>
        <AuthProvider>
            <ProyectosProvider>
                <Routes>
                {/*
                cuando la aplicación se cargue en la ruta raíz ("/"), se renderice el componente <AuthLayout/>, y dentro de ese componente, si la URL coincide con index, se renderizará el componente <Login/>, si es /registrar -> el componente <Registrar> y así sucesivamente
                */}
                <Route path={"/"} element={<AuthLayout/>}>
                    <Route index element={<Login/>}/>
                    <Route path={"registrar"} element={<Registrar/>}/>{/*No es necesario poner /registrar, porque ya coge la barra*/}
                    <Route path={"olvide-password"} element={<OlvidePassword/>}/>
                    <Route path={"olvide-password/:token"} element={<NuevoPassword/>}/>
                    <Route path={"confirmar/:token"} element={<ConfirmarCuenta/>}/>
                </Route>

                {/*<RutaProtegida> es un componente que va a tener toda la lógia para proteger al resto de componentes, de manera que si no estás autenticado no puedas acceder a ellos*/}
                <Route path={"/proyectos"} element={<RutaProtegida/>}>
                    <Route index element={<Proyectos />} />
                    <Route path={"crear-proyecto"} element={<NuevoProyecto />} />
                    <Route path={"nuevo-colaborador/:id"} element={<NuevoColaborador />} />
                    <Route path={":id"} element={<Proyecto/> } />
                    <Route path={"editar/:id"} element={<EditarProyecto />} />
                </Route>

            </Routes>
            </ProyectosProvider>
        </AuthProvider>

    </BrowserRouter>
  )
}

export default App
