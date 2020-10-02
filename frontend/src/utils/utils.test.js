const mockDB = require("../DB/mockDB.json");
import "@testing-library/jest-dom";

import {configure, shallow} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import {displayedData} from "../components/main/Main"
import getTopicData, { displayLinks } from "./utils";

describe("getTopicData", () => {
  test('should return "webdev" if looking for "webdev" (first element in mockDB)', () => {
    const res = getTopicData(mockDB, "webdev");
    expect(res.topic).toBe("webdev");
  });
  test('should return "node" if looking for "node" (sublevel in first element in mockDB)', () => {
    const res = getTopicData(mockDB, "node");
    expect(res.topic).toBe("node");
  });
  test('should return "javascript" if looking for "javascript" (second element in mockDB)', () => {
    const res = getTopicData(mockDB, "javascript");
    expect(res.topic).toBe("javascript");
  });
});
// https://medium.com/@relasine/testing-component-methods-that-return-jsx-in-react-dc8032e3cf22
describe("displayLinks", () => {
  test("should return links when checking valid input", () => {
   const res = (displayLinks(mockDB[0])).map(x => shallow(x).html())
   expect(res[0]).toBe(`<li class="list-group-item"><a href="https://www.appbrewery.co/p/web-development-course-resources/">Web Development Course Resources | The App Brewery</a></li>`)
  });

  test("should return default when inputting default data", () => {
   const res = (displayLinks(displayedData)).map(x => shallow(x).html())
   expect(res[0]).toBe(`<li class="list-group-item"><a href="https://www.lynda.com/Web-Development-training-tutorials/1471-0.html\">Web Development - Online Courses, Classes, Training, Tutorials on Lynda</a></li>`)
  });

  test("should return 'No links provided.' when checking input without links", () => {
   const res = shallow(displayLinks(mockDB[1].sublevels[0])).html()
   expect(res).toBe(`<p>No links provided.</p>`)
  });
  
  test("should return 'No links provided.' when checking empty array", () => {
   const res = shallow(displayLinks([])).html()
   expect(res).toBe(`<p>No links provided.</p>`)
  });
});
