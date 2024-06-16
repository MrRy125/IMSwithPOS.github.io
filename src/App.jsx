import { useState, React} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import Sidebar from './components/SideBar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products';
import POS from './pages/POS'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales';
import Reports from './pages/Reports';

function App() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <>
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <Router>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/products" element={<Products />}/>            
            <Route path="/pos" element={<POS />}/>            
            <Route path="/purchases" element={<Purchases />}/>
            <Route path="/sales" element={<Sales />}/>        
            <Route path="/reports" element={<Reports />}/>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
