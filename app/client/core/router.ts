const dbReady = new CustomEvent("dbReady", { bubbles: true });
const pageChange = new CustomEvent("pageChange", { bubbles: true });

let route:string;
let currentParam:string;
let htmlData:HTMLElement = document.createElement("html");
let collections:string[] = ["pages"];

/**
 * Init website
 * @type {HTMLDivElement}
 */
(async () => {

  type Route = {
    slug: string;
    fileName: string;
    title: string;
  }

  type RoutesList = {
    [key: string]: Route;
  }

  let routesList:RoutesList = {};

  const getHtmlData:any = await fetch("assets/app.html");
  htmlData.innerHTML = await getHtmlData.text();

  let promises = [];
  for (let i = 0; i < collections.length; i++) {
    promises[i] = new Promise<unknown>( async resolve => {
      const fetchRes:any = await fetch(`/api?action=get&name=${collections[i]}`);
      const result:any = fetchRes.json();
      resolve(result);
    })
  }

  let promiseResult:any = await Promise.all(promises);

  for (let i = 0; i < promiseResult.length; i++) {
    for (let y = 0; y < promiseResult[i].length; y++){
      routesList[(i * promiseResult[i].length + y).toString()] = {
        slug: promiseResult[i][y].slug,
        fileName: promiseResult[i][y].fileName,
        title: promiseResult[i][y].title
      }
    }
  }

  document.dispatchEvent(dbReady);


  /**
   * Manage history and back to prev page
   */
  window.onpopstate = e => {
    let dataID:string = "";

    for (const [key, value] of Object.entries(routesList)) {
      if(value.slug === document.location.pathname.replace("/", ""))
        dataID = value.fileName;
    }

    if(e.state !== null){
      document.getElementById("content")!.innerHTML = htmlData.querySelector(`[data-id='${dataID}']`)!.innerHTML;
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.dispatchEvent(pageChange);
      }, 100);
    }
  };

  let pagesRoutes = new Router(routesList);

})();


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

