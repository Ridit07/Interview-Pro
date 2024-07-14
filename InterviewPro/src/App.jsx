import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import Pricingpage from './pages/pricingpage';
import Pricingpage2 from './components/pricingpage2';
import Login from './components/login';
import LoginPage from './pages/LoginPage';
import Login2 from './components/login2';
import Login3 from './components/login3';
import SignupPrimaryPage from './pages/SignPrimaryPage';
import Dashboard1 from './components/dashboard1';
import Dashboard2 from './components/dashboard2';
import Dashboard3 from './components/dashboard3';
import Dashboard4 from './components/dashboard4';
import Dashboard5 from './components/dashboard5';
import Dashboard6 from './components/dashboard6';
import ReqInterview1 from './components/reqInterview1';
import ReqInterview2 from './components/reqInterview2';
import ReqInterview3 from './components/reqInterview3';
import ReqInterview4 from './components/reqInterview4';
import Feedback from "./components/Feedback";
import ReqInterview5 from './components/reqInterview5';
import Preview1 from './components/preview1';
import Preview2 from './components/preview2';
import VideoCall1 from './components/VideoCall1';
import CodeEditorWindow from './components/CodeEditor';
import Signup2 from './components/signup2';
import Interlogin from './components/interlogin';
import AboutUs from './pages/aboutus';
import ContactUs from './pages/contactus';
import VideoCall2 from './components/VideoCall2';
import Candilogin from './components/Candilogin2';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/pricing" element={<Pricingpage />} />
          <Route path="/pricing2" element={<Pricingpage2 />} />
          <Route path="/login1" element={<Login/>} />
          <Route path="/login2" element={<Login2/>} />
          <Route path="/login3" element={<Login3/>} />
          <Route path="/signprimary" element={<SignupPrimaryPage />} />
          <Route path="/dashboard" element={<Dashboard1 />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/dashboard3" element={<Dashboard3 />} />
          <Route path="/dashboard4" element={<Dashboard4 />} />
          <Route path="/dashboard5" element={<Dashboard5 />} />
          <Route path="/dashboard6" element={<Dashboard6 />} />
          <Route path="/reqinterview" element={<ReqInterview1 />} />
          <Route path="/reqinterview2" element={<ReqInterview2 />} />
          <Route path="/reqinterview3" element={<ReqInterview3 />} />
          <Route path="/reqinterview4" element={<ReqInterview4 />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/reqinterview5" element={<ReqInterview5 />} />
          <Route path="/preview1" element={<Preview1 />} />
          <Route path="/preview2" element={<Preview2 />} />
          <Route path='/video1' element={<VideoCall1/>}/>
          <Route path='/video' element={<CodeEditorWindow/>}/>
          <Route path='/signup2' element={<Signup2/>}/>
          <Route path='/interlogin' element={<Interlogin/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/contact' element={<ContactUs/>}/>
          <Route path='/video2' element={<VideoCall2/>}/>
          <Route path="/login" element={<LoginPage/>} />
          <Route path='/condilogin' element={<Candilogin/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;