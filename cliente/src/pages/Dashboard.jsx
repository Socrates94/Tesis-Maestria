import React from 'react';
import { Activity, ShieldCheck, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Panel de Control</h1>
        <p className="text-muted">Gestión de Identidad Auto-Soberana Institucional</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--color-text-muted)' }}>Conexiones Activas</h3>
            <Users size={24} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>42</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>+5 esta semana</p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--color-text-muted)' }}>Credenciales Emitidas</h3>
            <ShieldCheck size={24} color="var(--color-success)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>128</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>100% verificadas en blockchain</p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--color-text-muted)' }}>Verificaciones (ZKP)</h3>
            <Activity size={24} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>356</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Pruebas matemáticas exitosas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
