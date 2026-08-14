import './App.css';

import { Outlet } from 'react-router-dom';

import Menu from './components/Menu';

import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <>
        <div className="App">
          <Menu />
            <Outlet />
          <Footer />
        </div>
      </>
    </div>
  )
}

export default App;