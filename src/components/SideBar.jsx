
import Footer from './Footer'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill}
 from 'react-icons/bs'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3  className='icon_header'/> InventioPOS
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="/dashboard">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/products">
                    <BsFillArchiveFill className='icon'/> Products
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/pos">
                    <BsFillGrid3X3GapFill className='icon'/> POS
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/purchases">
                    <BsPeopleFill className='icon'/> Purchases
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/sales">
                    <BsListCheck className='icon'/> Sales
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/reports">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </a>
            </li>
        </ul>
        <Footer />
    </aside>
  )
}

export default Sidebar