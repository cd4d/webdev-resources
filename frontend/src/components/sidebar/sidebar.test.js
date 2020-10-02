import "@testing-library/jest-dom";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import App from "../app/App";
import { configure, mount, shallow, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
//import SidebarItem from "./Sidebar";
import { mockDB } from "../app/App";
import { Link, MemoryRouter } from "react-router-dom";

// wrapping render calls inside a router
const wrapper = mount(
  <MemoryRouter>
    <App />
  </MemoryRouter>
);

function SidebarItem(item) {
  return (
    <li key={uuidv4()}>
      {<Link to={`${item.stringUrl}${item.topic}`}>{item.title}</Link>}
      {/* Sublevel */}
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
function populateSidebar(db) {
  return db.map((item) => (
    <SidebarItem key={uuidv4()} stringUrl="/" depth={0} {...item} />
  ));
}
describe("Sidebar generation", () => {
  test("Should populate the sidebar with topics from database", () => {
    const res = populateSidebar(mockDB).map((x) => wrapper.render(x).html());
    expect(res.length).toEqual(mockDB.length);
  });

  test("Should provide correct links to sublevels (not undefined)", () => {
    const res = populateSidebar(mockDB).map((x) => wrapper.render(x).html());
    res.forEach((link) => {
      expect(link).not.toContain("undefined");
    });
  });
});
