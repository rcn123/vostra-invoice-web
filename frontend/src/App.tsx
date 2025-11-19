import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import UploadPage from './pages/UploadPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/demo/upload" element={<UploadPage />} />
          <Route path="/demo/invoices" element={<InvoiceListPage />} />
          <Route path="/demo/invoice/:id" element={<InvoiceDetailPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
