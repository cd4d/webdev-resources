const cheerio = require("cheerio");
const axios = require("axios");
// See https://andrejgajdos.com/how-to-create-a-link-preview/
// Custom version using cheerio instead of pupeeter (no headless browser)
// Generate open graph preview links with image description etc. Defaults to user input and default image otherwise
const OPEN_GRAPH_PROPERTIES = [
  "og:title",
  "og:type",
  "og:image",
  "og:url",
  "og:description",
  "og:site_name",
  "og:video",
];

const getSiteName = (loadedHtml) => {
  const ogSiteName = loadedHtml('meta[property="og:site_name"]')["0"];
  if (ogSiteName != null && ogSiteName.attribs.content.length > 0) {
    return ogSiteName.attribs.content;
  }
};

const getTitle = (loadedHtml) => {
  const ogTitle = loadedHtml('meta[property="og:title"]')["0"];
  if (ogTitle != null && ogTitle.attribs.content.length > 0) {
    return ogTitle.attribs.content;
  }
  const twitterTitle = loadedHtml('meta[name="twitter:title"]')["0"];
  if (twitterTitle != null && twitterTitle.attribs.content.length > 0) {
    return twitterTitle.attribs.content;
  }
  const docTitle = loadedHtml.title;
  if (docTitle != null && docTitle.length > 0) {
    return docTitle;
  }
  const h1 = loadedHtml("h1").innerHTML;
  if (h1 != null && h1.length > 0) {
    return h1;
  }
  const h2 = loadedHtml("h1").innerHTML;
  if (h2 != null && h2.length > 0) {
    return h2;
  }
  return null;
};

const getDescription = (loadedHtml) => {
  const ogDescription = loadedHtml('meta[property="og:description"]')["0"];
  if (ogDescription != null && ogDescription.attribs.content.length > 0) {
    return ogDescription.attribs.content;
  }
  const twitterDescription = loadedHtml('meta[name="twitter:description"]')[
    "0"
  ];
  if (
    twitterDescription != null &&
    typeof metaDescription !== "undefined" &&
    twitterDescription.content.length > 0
  ) {
    return twitterDescription.attribs.content;
  }
  const metaDescription = loadedHtml('meta[name="description"]')["0"];
  if (metaDescription !== null && typeof metaDescription !== "undefined") {
    if (metaDescription.attribs.content.length > 0)
      return metaDescription.attribs.content;
  }
  // let paragraphs = loadedHtml("p");
  // let fstVisibleParagraph = null;
  // for (let i = 0; i < paragraphs.length; i++) {
  //   if (
  //     // if object is visible in dom
  //     paragraphs[i].offsetParent !== null &&
  //     !paragraphs[i].childElementCount != 0
  //   ) {
  //     fstVisibleParagraph = paragraphs[i].textContent;
  //     break;
  //   }
  // }
  // return fstVisibleParagraph;
};

const getDomainName = (loadedHtml) => {
  const canonicalLink = loadedHtml("link[rel=canonical]")["0"];
  if (canonicalLink != null && canonicalLink.attribs.href.length > 0) {
    return canonicalLink.attribs.href;
  }
  const ogUrlMeta = loadedHtml('meta[property="og:url"]')["0"];
  if (ogUrlMeta != null && ogUrlMeta.attribs.content.length > 0) {
    return ogUrlMeta.attribs.content;
  }
  return null;
};

// File size check not implemented as it would make the requests much longer
// Find og:image in document header. If og:image doesn’t exists, find <link rel="image_src"> tag in header. If <link rel="image_src"> tag doesn’t exist, find all images in document body. Remove all images less than 50 pixels in height or width and all images with a ratio of longest dimension to shortest dimension greater than 3:1. Return image with the greatest area.

const getImg = (loadedHtml, url) => {
  const ogImg = loadedHtml('meta[property="og:image"]')["0"];
  if (ogImg != null && ogImg.attribs.content.length > 0) {
    return ogImg.attribs.content;
  }
  const imgRelLink = loadedHtml('link[rel="image_src"]')["0"];
  if (imgRelLink != null && imgRelLink.attribs.href.length > 0) {
    return imgRelLink.attribs.href;
  }
  const twitterImg = loadedHtml('meta[name="twitter:image"]')["0"];
  if (twitterImg != null && twitterImg.attribs.content.length > 0) {
    return twitterImg.attribs.content;
  }

  return null;
};

const getLinkPreview = async function (url) {
  try {
    // Fetching HTML
    let html;
    const response = await axios(url);
    if (response && response.data) {
      html = response.data;
    }
    //console.log("html: ", html);
    // Extract open graph tags using cheerio
    const loadedHtml = cheerio.load(html);
    const openGraphTitle = getTitle(loadedHtml);
    const openGraphDescription = getDescription(loadedHtml);
    const openGraphSiteName = getSiteName(loadedHtml);

    const openGraphDomainName = getDomainName(loadedHtml);
    const openGraphImage = getImg(loadedHtml, url);

    const linkPreview = {
      openGraphTitle: openGraphTitle,
      openGraphDescription: openGraphDescription,
      openGraphSiteName: openGraphSiteName,
      openGraphDomainName: openGraphDomainName,
      openGraphImage: openGraphImage,
    };

    return linkPreview;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getLinkPreview };

// const IMDB = "https://www.imdb.com/title/tt0117500/";
// extractHtml("https://andrejgajdos.com/");

{
  /* <html prefix="og: https://ogp.me/ns#">
<head>
<title>The Rock (1996)</title>
<meta property="og:title" content="The Rock" />
<meta property="og:type" content="video.movie" />
<meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
<meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
...
</head>
...
</html> */
}
