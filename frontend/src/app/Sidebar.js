import React from "react";
import "./sidebar.css";
import { v4 as uuidv4 } from "uuid";
// https://dev.to/jsmanifest/create-a-modern-dynamic-sidebar-menu-in-react-using-recursion-36eo

function SidebarItem(item) {

  return (
    <li key={uuidv4()}>
      { <a href={`/${item.topic}`}>{item.title}</a>}
      {/* Sublevel */}
      {Array.isArray(item.sublevels) && (
        <ul>
          {item.sublevels.map((subItem) => (
            <SidebarItem key={uuidv4()} depth={item.depth + 1} {...subItem} />
          ))}
        </ul>
      )}
    </li>
  );
}
export default function (props) {

  return (
    <>
      <input type="checkbox" id="mobile-menu-checkbox" />
      <div className="sidebar column">
        <nav className="content">
          <ul className="sidebar-items">
            {props.mockDB.map((item) => (
              <SidebarItem key={uuidv4()} depth={0} {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
