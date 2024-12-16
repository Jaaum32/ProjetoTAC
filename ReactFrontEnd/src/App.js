import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HealthRecord from './Pages/HealthRecord';
import Geofencing from './Pages/Geofencing';
import Animal from './Pages/Animal';
import Reproduction from './Pages/Reproduction';
import Sidebar from './Components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Geofencing />} />
          <Route path="/geofencing" element={<Geofencing />} />
          <Route path="/animal" element={<Animal />} />
          <Route path="/healthrecord" element={<HealthRecord />} />
          <Route path="/reproduction" element={<Reproduction />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
