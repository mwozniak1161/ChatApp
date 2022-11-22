import './App.css';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Home from './pages/Home';
import Profiles from './pages/Profiles';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';
import Dashboard from './components/Dashboard';
import Conversation from './pages/Conversation';
import Profile from './pages/Profile';
import Setting from './pages/Setting';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <main className="App">
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path='/app' element={<Dashboard/>}>
          <Route path="conversations" element={<Conversations />}  >
            <Route path=":login" element={<Conversation />} />
          </Route>
          <Route path="profiles" element={<Profiles />}  >
            <Route path=":login" element={<Profile/>} />
          </Route>
          <Route path="settings" element={<Settings />}  >
            <Route path=":settingType" element={<Setting/>} />
          </Route>
        </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
      </AnimatePresence>
    </main>
  );
}

export default App;
