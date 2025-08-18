import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import AddItem from "../pages/record/Components/Additem";
import { CiViewList } from "react-icons/ci";
import { FaCamera, FaChartLine } from "react-icons/fa6";
import { RiSettingsFill } from "react-icons/ri";

const Navbar = () => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [path, setPath] = useState(typeof window !== "undefined" ? window.location.pathname : "/");

  useEffect(() => {
    // update on browser navigation (back/forward)
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // helper to update path quickly when user clicks anchors (SPA or full reload)
  const handleNavClick = (href) => {
    setPath(href);
  };

  
  return (
    <>
      <nav
        dir="rtl"
        className="fixed bottom-0 w-screen h-12 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-inset-bottom flex justify-around items-center shadow-sm"
        aria-label="Bottom navigation"
      >
        <div className="max-w-xl mx-auto">
          <ul className="flex items-center justify-between h-16 px-2 w-screen">
            {/* first item */}
            <NavItem
              icon={<GoHomeFill className="text-3xl" />}
              label="رئيسية"
              href="/"
              active={path === "/"}
              onClick={() => handleNavClick("/")}
            />

            {/* second item */}
            <NavItem
              icon={<CiViewList className="text-3xl" />}
              label="الدفتر"
              href="/history"
              active={path === "/history"}
              onClick={() => handleNavClick("/history")}
            />

            {/* Center floating create button (Instagram-style gradient ring) */}
              {localStorage.getItem("balance") ? (
               
                    <NavItem
              icon={<FaCamera className="text-2xl" />}
              label="إلتقاط"
              href="/"
              active={path === "/none"}
              onClick={() => handleNavClick("/")}

            />
              ) : (
              null
              )}

            {/* fourth item */}
            <NavItem
              icon={<FaChartLine className="text-2xl" />}
              label="الجدول"
              href="/chart"
              active={path === "/chart"}
              onClick={() => handleNavClick("/chart")}
            />

            {/* fifth item */}
            <NavItem
              icon={<RiSettingsFill className="text-2xl" />}
              label="البيانات المحفوطة"
              href="/HistoryCopyPage"
              active={path === "/HistoryCopyPage"}
              onClick={() => handleNavClick("/HistoryCopyPage")}
            />
          </ul>
        </div>
      </nav>

      {/* Add item modal */}
      {showAddItem && <AddItem onClose={() => setShowAddItem(false)} />}
    </>
  );
};

const NavItem = ({ icon, label, href, active = false, onClick = () => {} }) => {
  return (
    <li className="flex-1 flex justify-center">
      <a
        href={href} // preserved exactly as you requested
        onClick={() => onClick(href)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
          active ? "text-black" : "text-gray-300 hover:text-black"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <div className="relative">
          {/* icon */}
          <span
            className={`inline-flex items-center justify-center  transition-transform`}
          >
            {icon}
          </span>
        </div>


        {/* thin active indicator like mobile apps */}
  
      </a>
    </li>
  );
};

export default Navbar;
