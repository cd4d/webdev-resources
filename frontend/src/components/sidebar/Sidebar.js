import React from "react";
import "./sidebar.css";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
// https://dev.to/jsmanifest/create-a-modern-dynamic-sidebar-menu-in-react-using-recursion-36eo

function SidebarItem(item) {
  return (
    <li key={uuidv4()}>
      {<Link to={`${item.stringUrl}${item.topic}`}>{item.title}</Link>}
      {/* Sublevel, adding topic to build url e.g webdev/node */}
      {Array.isArray(item.sublevels) && (
        <ul>
          {item.sublevels.map((subItem) => (
            <SidebarItem
              key={uuidv4()}
              depth={item.depth + 1}
              stringUrl={item.stringUrl + item.topic + "/"}
              {...subItem}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
export default function Sidebar(props) {
  return (
    <>
      <input type="checkbox" id="mobile-menu-checkbox" />
      <div className="sidebar column">
        <nav className="content">
          <ul className="sidebar-items">
            {props.mockDB.map((item) => (
              <SidebarItem key={uuidv4()} depth={0} stringUrl="/" {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
