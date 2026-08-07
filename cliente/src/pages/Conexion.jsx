import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Copy, Check, Loader2 } from 'lucide-react';
import { crearInvitacion } from '../services/api';

const Conexion = () => {
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQR = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await crearInvitacion();
      setInvitationData(data);
    } catch (err) {
      console.error(err);
      setError('Error al generar la invitación. Verifica que el backend esté corriendo en el puerto 8082.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (invitationData?.connection_id) {
      navigator.clipboard.writeText(invitationData.connection_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Paso 1: Establecer Conexión (OOB)</h1>
        <p className="text-muted">Genera un código QR para que el alumno lo escanee con su BC Wallet.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        {!invitationData && (
          <div style={{ padding: '2rem 0' }}>
            <QrCode size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1.5rem' }}>Listo para recibir alumnos</h3>
            <button 
              className="btn btn-primary" 
              onClick={handleGenerateQR}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <QrCode size={18} />}
              Generar Código QR
            </button>
            {error && <p style={{ color: 'var(--color-danger)', marginTop: '1rem' }}>{error}</p>}
          </div>
        )}

        {invitationData && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <h3 className="text-gradient">¡Invitación Generada!</h3>
            
            <div className="qr-container">
              <QRCodeCanvas 
                value={invitationData.invitation_url} 
                size={250}
                level={"H"}
                includeMargin={true}
              />
            </div>

            <p className="text-muted" style={{ maxWidth: '80%' }}>
              Pide al alumno que abra su BC Wallet y escanee este código para establecer un canal seguro (DIDComm).
            </p>

            <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textAlign: 'left' }}>Connection ID (Guárdalo para el Paso 2):</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={invitationData.connection_id}
                  readOnly
                  className="form-control"
                  style={{ fontFamily: 'monospace', flex: 1 }}
                />
                <button 
                  className={`btn ${copied ? 'btn-primary' : 'btn-outline'}`}
                  onClick={copyToClipboard}
                  title="Copiar Connection ID"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <button 
              className="btn btn-outline" 
              onClick={() => setInvitationData(null)}
              style={{ width: '100%' }}
            >
              Generar otro código
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Conexion;
