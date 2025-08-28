import React, { useState, useEffect } from "react";
import { GoHomeFill } from "react-icons/go";
import AddItem from "../pages/record/Components/Additem";
import { CiViewList } from "react-icons/ci";
import { FaCamera, FaChartLine } from "react-icons/fa6";
import { RiSettingsFill } from "react-icons/ri";

// Navbar with light / dark support and indigo as the main color
// Reads theme from localStorage ('theme') and applies conditional Tailwind classes

const Navbar = () => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [path, setPath] = useState(typeof window !== "undefined" ? window.location.pathname : "/");
  const data = typeof window !== "undefined" ? localStorage.getItem('data') : null;

  // read theme (client-side)
  const THEME = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';
  const isDark = THEME === 'dark';

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

  // themed classes
  const navBg = isDark ? 'bg-black ' : 'bg-white border-gray-50';
  const navTextInactive = isDark ? 'text-gray-500' : 'text-gray-300';
  const navTextActive = isDark ?'text-white' : 'text-black'; // main color is indigo
  const iconBase = 'transition-transform';

  return (
    <>
      {Boolean(data) ? (
        <nav
          dir="rtl"
          className={`fixed bottom-0 w-screen h-14 left-0 right-0 z-40 ${navBg} safe-area-inset-bottom flex justify-around items-center border-t`}
          aria-label="Bottom navigation"
        >
          <div className="max-w-xl mx-auto w-full">
            <ul className="flex items-center justify-between h-16 px-2 w-screen">
              {/* first item */}
              <NavItem
                icon={<GoHomeFill className="text-3xl" />}
                href="/"
                active={path === "/"}
                onClick={() => handleNavClick("/")}
                isDark={isDark}
                navTextActive={navTextActive}
                navTextInactive={navTextInactive}
                iconBase={iconBase}
              />

              {/* second item */}
              <NavItem
                icon={<CiViewList className="text-3xl" />}
                href="/history"
                active={path === "/history"}
                onClick={() => handleNavClick("/history")}
                isDark={isDark}
                navTextActive={navTextActive}
                navTextInactive={navTextInactive}
                iconBase={iconBase}
              />

              {/* Center floating create button (uses indigo ring/gradient) */}
              {localStorage.getItem("balance") ? (
                <NavItem
                  icon={<FaCamera className="text-2xl" />}
                  href="/camera"
                  active={path === "/camera"}
                  onClick={() => handleNavClick("/camera")}
                  isDark={isDark}
                  navTextActive={navTextActive}
                  navTextInactive={navTextInactive}
                  iconBase={`${iconBase}  p-2`}
                />
              ) : null}

              {/* fourth item */}
              <NavItem
                icon={<FaChartLine className="text-2xl" />}
                href="/chart"
                active={path === "/chart"}
                onClick={() => handleNavClick("/chart")}
                isDark={isDark}
                navTextActive={navTextActive}
                navTextInactive={navTextInactive}
                iconBase={iconBase}
              />

              {/* fifth item */}
              <NavItem
                icon={<RiSettingsFill className="text-2xl" />}
                href="/HistoryCopyPage"
                active={path === "/HistoryCopyPage"}
                onClick={() => handleNavClick("/HistoryCopyPage")}
                isDark={isDark}
                navTextActive={navTextActive}
                navTextInactive={navTextInactive}
                iconBase={iconBase}
              />
            </ul>
          </div>
        </nav>
      ) : null}

      {/* Add item modal */}
      {showAddItem && <AddItem onClose={() => setShowAddItem(false)} />}
    </>
  );
};

const NavItem = ({ icon, label, href, active = false, onClick = () => {}, isDark = false, navTextActive = 'text-indigo-600', navTextInactive = 'text-gray-300', iconBase = '' }) => {
  return (
    <li className="flex-1 flex justify-center">
      <a
        href={href} // preserved exactly as requested
        onClick={() => onClick(href)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${active ? navTextActive : navTextInactive}`}
        aria-current={active ? "page" : undefined}
      >
        <div className="relative">
          {/* icon */}
          <span className={`inline-flex items-center justify-center ${iconBase}`}>
            {icon}
          </span>
        </div>

        <span className="text-xs mt-1">{label}</span>
      </a>
    </li>
  );
};

export default Navbar;
