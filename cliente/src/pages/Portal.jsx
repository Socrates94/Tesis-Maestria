import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, QrCode, FileCheck } from 'lucide-react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const Portal = () => {
  const [student, setStudent] = useState(null);
  const [invitationUrl, setInvitationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('buap_session');
    if (!session) {
      navigate('/');
    } else {
      setStudent(JSON.parse(session));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('buap_session');
    navigate('/');
  };

  const getCredential = async () => {
    setLoading(true);
    try {
      // Llamar al backend Emisor para obtener una invitación OOB
      // En un flujo real, también emitiríamos la credencial al establecerse la conexión.
      const response = await axios.post('http://localhost:8082/credenciales/invitacion');
      if (response.data && response.data.invitation_url) {
        setInvitationUrl(response.data.invitation_url);
      } else {
        alert('Error al generar la invitación. Revisa los logs del backend.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el Emisor (Puerto 8082)');
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="portal-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h2>Portal del Alumno (BUAP)</h2>
        <button onClick={handleLogout} className="action-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#333' }}>
          <LogOut size={16} /> Salir
        </button>
      </header>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="text-gradient">Mis Datos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div><strong>Nombre:</strong> {student.nombre_completo}</div>
          <div><strong>Matrícula:</strong> {student.matricula}</div>
          <div><strong>Facultad:</strong> {student.facultad}</div>
          <div><strong>Nivel:</strong> {student.nivel}</div>
          <div><strong>Estatus:</strong> <span style={{ color: '#4caf50' }}>{student.estatus_inscripcion}</span></div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        {!invitationUrl ? (
          <div>
            <FileCheck size={48} className="text-gradient" style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <h3>Credencial Digital de Acceso</h3>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>Genera tu credencial digital (SSI) para usarla en los torniquetes físicos de la universidad.</p>
            <button onClick={getCredential} disabled={loading} className="action-button" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
              {loading ? 'Generando...' : 'Generar Credencial SSI'}
            </button>
          </div>
        ) : (
          <div>
            <QrCode size={48} className="text-gradient" style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <h3>¡Credencial Lista para Descargar!</h3>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>Escanea este código QR con tu BC Wallet para guardar la credencial en tu teléfono.</p>
            
            <div style={{ background: '#fff', padding: '1rem', display: 'inline-block', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <QRCodeSVG value={invitationUrl} size={256} />
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#555', wordBreak: 'break-all' }}>{invitationUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
