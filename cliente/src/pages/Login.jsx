import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Login = () => {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (matricula && password) {
      // Simulación simple de login
      localStorage.setItem('buap_session', JSON.stringify({
        matricula: matricula,
        nombre_completo: "Daniel Estudiante",
        facultad: "Ciencias de la Computación",
        estatus_inscripcion: "Activo",
        nivel: "Maestría"
      }));
      navigate('/portal');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} className="text-gradient" style={{ margin: '0 auto' }} />
          <h2 className="text-gradient" style={{ marginTop: '1rem' }}>Autoservicios BUAP</h2>
          <p style={{ color: '#888' }}>Acceso a Credencial Digital</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>Matrícula</label>
            <input 
              type="text" 
              value={matricula} 
              onChange={(e) => setMatricula(e.target.value)}
              className="tool-input"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
              placeholder="Ej. 20240001"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="tool-input"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#111', color: 'white' }}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="action-button" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
