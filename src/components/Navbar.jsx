import React, { useState } from "react";
import {
  BsFileText,
  BsClipboardData,
  BsPlus,
  BsClockHistory,
  BsListOl,
  BsCamera,
} from "react-icons/bs";
import AddItem from "../pages/record/Components/Additem";

const Navbar = () => {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <>
      {/* Navbar with reduced height */}
      <div className="fixed bottom-0 left-0 right-0 h-14 w-full bg-white border-t border-gray-200 z-20">
        <ul className="flex justify-between items-center h-full px-1">
          {/* Record */}
          <NavItem 
            icon={<BsFileText className="text-xl" />}
            label="التسجيل"
            href="/"
          />
          
          <NavItem 
            icon={<BsListOl className="text-xl"/>}
            label="الدفتر"
            href="/history"
          />
          
          {/* Add Item Button */}
          {localStorage.getItem('balance') && (
            <li className="relative">
              <button
                onClick={() => setShowAddItem(true)}
      className="flex flex-col items-center justify-center  hover:text-blue-600 w-full py-1 transition-colors"
                aria-label="إضافة عنصر"
              >
                <BsCamera className="text-xl" />
      <span className="text-[10px] mt-1"> إلتقاط</span>
              </button>
            </li>

          )}
          
          <NavItem 
            icon={<BsClipboardData className="text-xl" />}
            label="الجدول"
            href="/chart"
          />    
          
          {/* Settings */}
          <NavItem 
            icon={<BsClockHistory className="text-xl" />}
            label="البيانات المحفوطة  "
            href="/HistoryCopyPage"
          />
          
        </ul>
      </div>
      
      {/* Add Item Modal */}
      {showAddItem && <AddItem onClose={() => setShowAddItem(false)} />}
    </>
  );
};

const NavItem = ({ icon, label, href }) => (
  <li className="flex-1 flex justify-center">
    <a 
      href={href}
      className="flex flex-col items-center justify-center  hover:text-blue-600 w-full py-1 transition-colors"
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </a>
  </li>
);

export default Navbar;