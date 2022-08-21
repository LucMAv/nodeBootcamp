const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate')

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

console.log(slugify('Fresh Avocados', { lower: true}))
const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));
console.log(slugs)

// ! SERVER
const server = http.createServer((req, res) => {
  // request and respose variables
//   console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);


  // * Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-tyoe": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
    return;

    // * Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-tyoe": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
    return;
    // * API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-tyoe": "application/json",
    });
    return res.end(data);

    // * Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }

  res.end("Hello from the farm");
});

server.listen(8000, "127.0.0.1", () => {
  // port, host(local),
  console.log("nodeFarm Server 🐷🐮🐑 on 8000");
});
