let dbReady = new CustomEvent("dbReady", { bubbles: true });
let pageChange = new CustomEvent("pageChange", { bubbles: true });
let routeList = [];
let routes = {};
let route;
let currentParam = "";
let htmlData = document.createElement("html");
let collections = ["pages"];

/**
 * Init website
 * @type {HTMLDivElement}
 */
(async () => {
  let getHtmlData = await fetch("assets/app.html");
  htmlData.innerHTML = await getHtmlData.text();

  for (let i = 0; i < collections.length; i++) {
    let fetchRes = await fetch(`/api?action=get&name=${collections[i]}`);
    let routes = await fetchRes.json();
    routes.forEach((e) => {
      let newPage = {
        slug: e.slug,
        fileName: e.fileName,
        title: e.title,
        access: e.access,
      };
      routeList.push(newPage);
    });
  }
  Object.assign(routes, routeList);
  document.dispatchEvent(dbReady);
})();

/**
 * Manage history and back to prev page
 */
window.onpopstate = e => {
  let dataID = "";
  routeList.forEach((route) => {
    if( route.slug === document.location.pathname.replace("/", "") )
      dataID = route.fileName;
  });
  if(e.state !== null){
    document.getElementById("content").innerHTML = htmlData.querySelector(`[data-id='${dataID}']`).innerHTML;
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.dispatchEvent(pageChange);
    }, 100);
  }
};

/**
 * Router to manage pages
 * @class
 */
class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener("hashchange", this.loadPage.bind(this));
    document.addEventListener("dbReady", this.loadPage.bind(this));
  }

  /**
   * Load Page before showing
   * @method
   * @param {string} [event] Event trigger
   * @returns {Promise<void>}
   */
  async loadPage(event) {
    this.event = event;
    route = location.hash || "#";
    if (route.endsWith("/")) route = route.slice(0, -1);
    let regex = /(\?|\&)([^=]+)\=([^&]+)/;
    let param = regex.exec(location.href);
    if (param) {
      let thisParam = param[0].replace("#", "");
      if (thisParam !== currentParam) {
        if (location.hash === "")
          route += thisParam;
        currentParam = thisParam;
      }
    }

    this.currentPage = await Object.values(this.routes).find(
      (elt) => route.replace(/(\?|\&)([^=]+)\=([^&]+)/, "") === `#${elt.slug}`
    );

    if (this.currentPage === undefined) {
      route = "#404";
      this.currentPage = Object.values(this.routes).find((elt) => `#${elt.slug}` === "#404");
    }

    await this.showPage();
  }

  /**
   * Show page
   * @method
   * @returns {Promise<void>}
   */
  async showPage() {
    this.currentHTML = htmlData.querySelector(`[data-id='${this.currentPage.fileName}']`).innerHTML;
    history.replaceState(this.currentHTML, this.currentPage.title, route.replace("#", "/"));
    document.getElementById("content").classList.remove("fade-in");
    document.getElementById("content").classList.add("fade-out");

    setTimeout(() => {

      document.getElementById("content").innerHTML = this.currentHTML;
      document.querySelector("title").innerHTML = this.currentPage.title;
      window.scrollTo(0, 0);

      document.getElementById("content").classList.remove("fade-out")
      document.getElementById("content").classList.add("fade-in")

      document.dispatchEvent(pageChange);

    }, 400);

  }
}
let pagesRoutes = new Router(routes);