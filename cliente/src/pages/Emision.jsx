import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { emitirCredencial } from '../services/api';

const Emision = () => {
  const [formData, setFormData] = useState({
    connectionId: '',
    schemaId: 'JDmZmbYJnRyz5mb5U9wCxK:2:Credencial Biblioteca:1.0',
    credDefId: 'JDmZmbYJnRyz5mb5U9wCxK:3:CL:13:default',
    nombre: '',
    id_lector: '',
    tipo_suscripcion: 'Basica'
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const datosAlumno = {
        nombre: formData.nombre,
        id_lector: formData.id_lector,
        tipo_suscripcion: formData.tipo_suscripcion
      };

      await emitirCredencial(
        formData.connectionId, 
        formData.schemaId, 
        formData.credDefId, 
        datosAlumno
      );
      
      setStatus({ loading: false, success: true, error: '' });
      // Resetear solo los datos del alumno, mantener IDs
      setFormData(prev => ({ ...prev, nombre: '', id_lector: '' }));
      
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.detail || 'Error al emitir la credencial. Verifica el Connection ID.' 
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Paso 2: Emitir Credencial</h1>
        <p className="text-muted">Envía la Credencial Verificable directamente a la billetera del alumno.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            1. Enlace de Destino
          </h3>
          <div className="form-group">
            <label className="form-label">Connection ID (Obtenido en el Paso 1)</label>
            <input 
              type="text" 
              name="connectionId" 
              value={formData.connectionId} 
              onChange={handleChange}
              className="form-control" 
              placeholder="Ej. c28a50f0-4a8f-4d9f-a0c3-9b6f8c7e6d5a"
              required 
            />
          </div>

          <h3 style={{ marginBottom: '1.5rem', marginTop: '2.5rem', color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            2. Datos del Alumno (Credencial de Biblioteca)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre del Alumno</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange}
                className="form-control" 
                placeholder="Ej. Juan Pérez"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Matrícula / ID Lector</label>
              <input 
                type="text" 
                name="id_lector" 
                value={formData.id_lector} 
                onChange={handleChange}
                className="form-control" 
                placeholder="Ej. 2024001"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Suscripción</label>
            <select 
              name="tipo_suscripcion" 
              value={formData.tipo_suscripcion} 
              onChange={handleChange}
              className="form-control"
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="Basica">Básica</option>
              <option value="Premium">Premium</option>
              <option value="Investigador">Investigador</option>
            </select>
          </div>

          {/* Hidden Config Fields but visually present for thesis context */}
          <details style={{ marginTop: '2rem', marginBottom: '1rem', cursor: 'pointer' }}>
            <summary className="text-muted" style={{ fontSize: '0.875rem' }}>Configuración Criptográfica Avanzada (Opcional)</summary>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Schema ID</label>
                <input type="text" name="schemaId" value={formData.schemaId} onChange={handleChange} className="form-control" style={{ fontSize: '0.8rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Credential Definition ID</label>
                <input type="text" name="credDefId" value={formData.credDefId} onChange={handleChange} className="form-control" style={{ fontSize: '0.8rem' }} />
              </div>
            </div>
          </details>

          {status.error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{status.error}</p>
            </div>
          )}

          {status.success && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', color: '#6ee7b7', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={20} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>¡Credencial enviada exitosamente! El alumno debe aceptarla en su BC Wallet.</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={status.loading || !formData.connectionId}>
              {status.loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {status.loading ? 'Emitiendo en Blockchain...' : 'Emitir Credencial Criptográfica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Emision;
