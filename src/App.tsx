import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import OccasionSelectionPage from '@/pages/OccasionSelectionPage';
import TemplateGalleryPage from '@/pages/TemplateGalleryPage';
import InvitationEditorPage from '@/pages/InvitationEditorPage';
import MessageCategoryPage from '@/pages/MessageCategoryPage';
import MessageEditorPage from '@/pages/MessageEditorPage';
import PublicInvitationPage from '@/pages/PublicInvitationPage';
import PublicMessagePage from '@/pages/PublicMessagePage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/occasions" element={<OccasionSelectionPage />} />
        <Route path="/templates/:occasion" element={<TemplateGalleryPage />} />
        <Route path="/editor/:templateId" element={<InvitationEditorPage />} />
        <Route path="/messages" element={<MessageCategoryPage />} />
        <Route path="/message-editor" element={<MessageEditorPage />} />
        <Route path="/invite/:slug" element={<PublicInvitationPage />} />
        <Route path="/message/:slug" element={<PublicMessagePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
