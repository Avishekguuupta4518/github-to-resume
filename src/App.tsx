import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import ResumeRoute from './routes/Resume';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/u/:username" element={<ResumeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
