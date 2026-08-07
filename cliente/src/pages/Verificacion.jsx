import React, { useState } from 'react';
import { Search, Fingerprint, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { solicitarVerificacion } from '../services/api';

const Verificacion = () => {
  const [formData, setFormData] = useState({
    connectionId: '',
    credDefId: 'JDmZmbYJnRyz5mb5U9wCxK:3:CL:13:default'
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const [verificationResult, setVerificationResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    setVerificationResult(null);

    try {
      const response = await solicitarVerificacion(formData.connectionId, formData.credDefId);
      setStatus({ loading: false, success: true, error: '' });
      setVerificationResult(response);
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.detail || 'Error al solicitar la verificación (ZKP).' 
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Paso 3: Verificación Zero-Knowledge</h1>
        <p className="text-muted">Solicita una prueba matemática de que el alumno posee la credencial (ZKP) sin revelar otros datos.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <AlertTriangle color="#facc15" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#fde047', margin: '0 0 0.5rem 0' }}>Privacidad por Diseño</h4>
            <p style={{ color: 'rgba(253, 224, 71, 0.8)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              Esta verificación solicitará únicamente el campo <strong>tipo_suscripcion</strong>. 
              El alumno no compartirá su nombre ni ID, pero el sistema validará criptográficamente 
              que la credencial es auténtica y fue emitida por nosotros.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Connection ID del Alumno a Verificar</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                name="connectionId" 
                value={formData.connectionId} 
                onChange={handleChange}
                className="form-control" 
                placeholder="Pega aquí el Connection ID..."
                required 
              />
              <button type="submit" className="btn btn-secondary" style={{ background: 'var(--color-secondary)' }} disabled={status.loading || !formData.connectionId}>
                {status.loading ? <Loader2 className="animate-spin" /> : <Fingerprint size={18} />}
                Solicitar Prueba ZKP
              </button>
            </div>
          </div>

          <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <summary className="text-muted" style={{ fontSize: '0.875rem' }}>Configuración (Opcional)</summary>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Restringir a Credential Definition ID</label>
                <input type="text" name="credDefId" value={formData.credDefId} onChange={handleChange} className="form-control" style={{ fontSize: '0.8rem' }} />
              </div>
            </div>
          </details>

        </form>

        {status.error && (
          <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5' }}>
            <p style={{ margin: 0 }}>{status.error}</p>
          </div>
        )}

        {status.success && (
          <div className="animate-fade-in" style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                <CheckCircle2 color="var(--color-success)" size={32} />
              </div>
              <div>
                <h3 style={{ color: 'var(--color-success)', margin: '0 0 0.25rem 0' }}>Solicitud Enviada con Éxito</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>El alumno ha recibido un PING en su celular. Esperando respuesta...</p>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1rem' }}>Detalles de la Transacción</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--color-text-muted)' }}>ID Transacción:</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{verificationResult?.presentation_exchange_id}</div>
                
                <div style={{ color: 'var(--color-text-muted)' }}>Estado Base:</div>
                <div style={{ color: 'var(--color-text-main)' }}>{verificationResult?.state}</div>
                
                <div style={{ color: 'var(--color-text-muted)' }}>BD Local:</div>
                <div style={{ color: 'var(--color-text-main)' }}>Guardado en verificación_records</div>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)' }}>
                  <Search className="animate-spin" size={16} />
                  <span style={{ fontSize: '0.875rem' }}>El Webhook en backend/api/webhooks.py se activará cuando el alumno acepte. Puedes revisar los logs de FastAPI para ver la magia criptográfica.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Verificacion;
