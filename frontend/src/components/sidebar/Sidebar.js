import React from "react";
import "./sidebar.css";
import { v4 as uuidv4 } from "uuid";
import { NavLink } from "react-router-dom";
// https://dev.to/jsmanifest/create-a-modern-dynamic-sidebar-menu-in-react-using-recursion-36eo


function SidebarItem(data) {
  return data.topics.map((topic) => (
    <li key={uuidv4()}>
      {/* Top levels, render if item has children elements */}
      {topic.children.length !== 0 && (
        <>
          <NavLink to={`${topic.slug}`}>{topic.title}</NavLink>
          {/* Renders the children elements. */}
          <ul>
            {topic.children.map((child) => (
              <li key={uuidv4()}>
                {" "}
                <NavLink to={`${topic.slug}/${child.slug}`}>
                  {child.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  ));
}

export default function Sidebar(props) {
  return (
    <>
      <input type="checkbox" id="mobile-menu-checkbox" />
      <div className="sidebar column">
        <nav className="content">
          <ul className="sidebar-items">
            <SidebarItem {...props} />
          </ul>
        </nav>
      </div>
    </>
  );
}

// OLD
// function SidebarItem(item) {
//  return (
//   <li key={uuidv4()}>
//     {<NavLink to={`${item.stringUrl}${item.topic}`}>{item.title}</NavLink>}
//     {/* Sublevel, adding topic to build url e.g webdev/node */}
//     {Array.isArray(item.sublevels) && (
//       <ul>
//         {item.sublevels.map((subItem) => (
//           <SidebarItem
//             key={uuidv4()}
//             depth={item.depth + 1}
//             stringUrl={item.stringUrl + item.topic + "/"}
//             {...subItem}
//           />
//         ))}
//       </ul>
//     )}
//   </li>
// );
//}

//{
/* <li key={uuidv4()}>
{" "}
<NavLink to={`${item.stringUrl}${item.slug}/${child.slug}`}>
  {child.title}
</NavLink>
</li> */
//}
// function SidebarItem(data) {
//   console.log("topics:", data.topics);
//   const result = [];
//   data.topics.forEach((topic) => {
//     if (topic.depth === 0)
//       result.push({ _id: topic._id, title: topic.title, slug: topic.slug });
//     if (topic.depth === 1) {
//       let pos = result.findIndex((el) => el._id === topic.parent);
//       console.log("position:", pos);
//       result.splice(pos, 0, {
//         _id: topic._id,
//         title: topic.title,
//         slug: topic.slug,
//       });
//     }
//   });
//   console.log("result array:", result);
//   return result.map((item) => (
//     <li key={uuidv4()}>
//       {<NavLink to={`${item.stringUrl}${item.topic}`}>{item.title}</NavLink>}
//       {/* Sublevel, adding topic to build url e.g webdev/node */}
//     </li>
//   ));
// }
