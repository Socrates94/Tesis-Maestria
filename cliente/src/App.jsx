import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Shield, UserPlus, FileBadge, CheckCircle, LayoutDashboard } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Conexion from './pages/Conexion';
import Emision from './pages/Emision';
import Verificacion from './pages/Verificacion';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <Shield size={32} className="text-gradient" />
            <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.25rem' }}>SSI Admin</h2>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/conexion" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserPlus size={20} />
              <span>1. Conexión (QR)</span>
            </NavLink>
            <NavLink to="/emision" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileBadge size={20} />
              <span>2. Emitir Credencial</span>
            </NavLink>
            <NavLink to="/verificacion" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <CheckCircle size={20} />
              <span>3. Verificar Alumno</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/conexion" element={<Conexion />} />
            <Route path="/emision" element={<Emision />} />
            <Route path="/verificacion" element={<Verificacion />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
