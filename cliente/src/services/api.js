import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082',
});

export const crearInvitacion = async () => {
  const response = await api.post('/credenciales/invitacion');
  return response.data;
};

export const emitirCredencial = async (connectionId, schemaId, credDefId, datosAlumno) => {
  const payload = {
    connection_id: connectionId,
    schema_id: schemaId,
    cred_def_id: credDefId,
    datos_alumno: datosAlumno
  };
  const response = await api.post('/credenciales/emitir', payload);
  return response.data;
};

export const solicitarVerificacion = async (connectionId, credDefId) => {
  const payload = {
    connection_id: connectionId,
    cred_def_id: credDefId
  };
  const response = await api.post('/verificacion/solicitar', payload);
  return response.data;
};
