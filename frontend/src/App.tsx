import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';

function App() {
  return (
    <Router basename="/vostra-invoice">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
