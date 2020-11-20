import React from "react";
import "./sidebar.css";
import { v4 as uuidv4 } from "uuid";
import { NavLink } from "react-router-dom";
// https://dev.to/jsmanifest/create-a-modern-dynamic-sidebar-menu-in-react-using-recursion-36eo

// TODO: refactor for mongodb. See temp/temp-db.json for a sample. Use parent, ancestors, id keys?
function SidebarItem(item) {
  return (
    <li key={uuidv4()}>
      {/* Top levels, render if no ancestors array */}
      {!Array.isArray(item.ancestors) || item.ancestors.length === 0 ? (
        <NavLink to={`${item.stringUrl}${item.topic}`}>{item.title}</NavLink>
      ) : (
        <ul>
          {item.ancestors.map((subItem) => (
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

// <SidebarItem key={uuidv4()} depth={0} stringUrl="/" {...item} />
export default function Sidebar(props) {
  console.log("sidebar props", props);
  return (
    <>
      <input type="checkbox" id="mobile-menu-checkbox" />
      <div className="sidebar column">
        <nav className="content">
          <ul className="sidebar-items">
            {props.topics.map((item) => (
              <SidebarItem key={uuidv4()} depth={0} stringUrl="/" {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

// function SidebarItem(item) {
//   return (
//     <li key={uuidv4()}>
//       {<NavLink to={`${item.stringUrl}${item.topic}`}>{item.title}</NavLink>}
//       {/* Sublevel, adding topic to build url e.g webdev/node */}
//       {Array.isArray(item.sublevels) && (
//         <ul>
//           {item.sublevels.map((subItem) => (
//             <SidebarItem
//               key={uuidv4()}
//               depth={item.depth + 1}
//               stringUrl={item.stringUrl + item.topic + "/"}
//               {...subItem}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
//}
