import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import EditLink from "./EditLink";
import logo from "../../static/logo-webresources.png";

import DeleteLink from "./DeleteLink";

const LINKS_PER_PAGE = 3;
const DESCRIPTION_MAX_CHARACTERS = 70;
// pagination
export default function DisplayLinks(props) {
  const { links } = props.displayedTopic;
  const [currentPage, setCurrentPage] = useState(1);
  // get  page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(links.length / LINKS_PER_PAGE); i++) {
    pageNumbers.push(i);
  }
  const indexOfLastLink = currentPage * LINKS_PER_PAGE;
  const indexOfFirstLink = indexOfLastLink - LINKS_PER_PAGE;
  const currentPageLinks = links.slice(indexOfFirstLink, indexOfLastLink);
  function changePageNumber(page) {
    setCurrentPage(page);
  }
  // truncate opengraph description
  function truncateDescription(description) {
    if (description.length > DESCRIPTION_MAX_CHARACTERS) {
      return description.substring(0, DESCRIPTION_MAX_CHARACTERS - 3) + "...";
    }
    return description;
  }
  const displayedLinks = currentPageLinks.map((link) => (
    <li key={uuidv4()} id={link._id} className="link-container">
      <div className="link-preview-left">
        {" "}
        <a className="link-preview-url" href={link.url}>
          {link.summary}
        </a>{" "}
        <div className="link-preview-summary">
          {link.openGraphDescription
            ? truncateDescription(link.openGraphDescription)
            : link.summary}
        </div>
        <div className="link-preview-buttons">
          {" "}
          <EditLink {...props} currentLink={link} />
          <DeleteLink {...props} currentLink={link} />
        </div>
      </div>
      <div className="link-preview-right">
        <a href={link.url}>
          <img
            className="img-link-preview"
            src={link.openGraphImage ? link.openGraphImage : logo}
            alt={link.summary}
          />
        </a>
      </div>
    </li>
  ));
  const pageNumbersButtons = pageNumbers.map((page) => (
    <button
      className="btn-pagination"
      key={uuidv4()}
      page={page}
      onClick={() => changePageNumber(page)}
    >
      {page}
    </button>
  ));

  return (
    <>
      {displayedLinks}
      {pageNumbers.length > 1 && (
        <div className="pagination-buttons-container">{pageNumbersButtons}</div>
      )}
    </>
  );
}
