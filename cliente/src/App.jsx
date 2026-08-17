import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Portal from './pages/Portal';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/portal" element={<Portal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
