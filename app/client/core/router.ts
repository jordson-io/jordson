/**
 * Router to manage pages
 * @class
 */
class Router {

  private currentHTML: string;
  private currentPage: Route;
  private currentParam: string
  private event: object | undefined;
  private route:string;
  private routes:RoutesList;

  constructor(routes:RoutesList) {
    this.routes = routes;
    window.addEventListener("hashchange", this.loadPage.bind(this));
    document.addEventListener("dataLoaded", this.loadPage.bind(this));
  }

  /**
   * Load Page before showing
   * @method
   * @param {object} [event] Event trigger
   * @returns {Promise<void>}
   */
  async loadPage(event:object) {
    this.event = event;

    this.route = location.hash || "#";
    if (this.route.endsWith("/"))
      this.route = this.route.slice(0, -1);

    const regex:RegExp = /(\?|\&)([^=]+)\=([^&]+)/;
    const params:string[] | null = regex.exec(location.href);

    if(params !== null) {
      let thisParam:string = params[0].replace("#", "");
      if (thisParam !== this.currentParam) {
        if (location.hash === "")
          this.route += thisParam;
        this.currentParam = thisParam;
      }
    }

    let newCurrentPage:Route | undefined = await Object.values(this.routes).find(
      elt => this.route.replace(regex, "") === `#${elt.slug}`
    );

    if(newCurrentPage !== undefined){
      this.currentPage = newCurrentPage
    } else {
      this.route = "#404";
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
    history.replaceState(this.currentHTML, this.currentPage.title , this.route.replace("#", "/"));
    document.getElementById("content").classList.remove("fade-in");
    document.getElementById("content").classList.add("fade-out");

    setTimeout(() => {
      document.getElementById("content").innerHTML = this.currentHTML;
      document.querySelector("title").innerHTML = this.currentPage.title;
      window.scrollTo(0, 0);

      document.getElementById("content").classList.remove("fade-out")
      document.getElementById("content").classList.add("fade-in")

      document.dispatchEvent(htmlLoaded);
    }, 400);
  }
}

