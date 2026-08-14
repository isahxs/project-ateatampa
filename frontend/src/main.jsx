import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { CartProvider } from './somacarrinho/CartContext.jsx';
import { AuthProvider } from './logout/AuthContext.jsx';

import App from './App.jsx';

import Home from './routes/Home/Home.jsx';

import BolosdePote from './routes/bolosdepote/BolosdePote.jsx';

import SobreNos from './routes/sobrenos/SobreNos.jsx';

import CarrinhodeCompra from './routes/carrinhodecompra/CarrinhodeCompra.jsx';

import LoginUsuario from './routes/loginusuario/LoginUsuario.jsx';

import LoginAdm from './routes/loginadm/LoginAdm.jsx';

import BolodePoteId from './routes/ID/BolodePoteId.jsx';

import Dashboard  from './routes/Dashboard/Dashboard.jsx';

import ErroRota from './routes/ErroRota.jsx';

import MeusPedidos from './routes/meuspedidos/MeusPedidos.jsx';

import CadastroAdm from './routes/cadastroadm/CadastroAdm.jsx';

import CadastroUsuario from './routes/cadastrousuario/CadastroUsuario.jsx';

import RecuperarSenhaAdm from './routes/recuperaradm/RecuperarSenhaAdm.jsx';

import RecuperarSenhaUsuario from './routes/recuperarsenhausuario/RecuperarSenhaUsuario.jsx';

import AlterarSenhaAdm from './routes/alterarsenhaadm/AlterarSenhaAdm.jsx';

import AlterarSenhaUsuario from './routes/alterarsenhausuario/AlterarSenhaUsuario.jsx';

import DigitarCodigoUsuario from './routes/digitarcodigousuario/DigitarCodigoUsuario.jsx';

import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';


const router = createBrowserRouter([
{
  path: "/",
  element: <App />,
  errorElement: <ErroRota />,

  children: [
    {
      index: true,
      element: <Home />
    },
    {
      path: "bolosdepote",
      element: <BolosdePote />
    },
    {
      path: "sobrenos",
      element: <SobreNos />
    },
    {
      path: "cadastrousuario",
      element: <CadastroUsuario />
    },
    {
      path: "carrinho",
      element: <CarrinhodeCompra />
    },
    {
      path: "loginusuario",
      element: <LoginUsuario />
    },
    {
      path: "recuperarsenhausuario",
      element: <RecuperarSenhaUsuario />
    },
    {
      path: "alterarsenhausuario",
      element: <AlterarSenhaUsuario />
    },
    {
      path: "bolos/:id",
      element: <BolodePoteId />
    },
    {
      path: "meuspedidos",
      element: <MeusPedidos />
    },
    {
      path: "loginadm",
      element: <LoginAdm />
    },
    {
      path: "cadastroadm",
      element: <CadastroAdm />
    },
    {
      path: 'recuperarsenhaadm',
      element: <RecuperarSenhaAdm />
    },
    {
      path: 'alterarsenhaadm',
      element: <AlterarSenhaAdm />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'digitarcodigousuario',
      element: <DigitarCodigoUsuario />
    },
  ]
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>    
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
