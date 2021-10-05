/** Copyright © 2021 André LECLERCQ
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 **/

/**
 * Router to manage pages
 * @class
 */
class Router {

  constructor(routes) {
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
  async loadPage(event) {
    this.event = event;

    this.route = location.hash || "#";
    if (this.route.endsWith("/"))
      this.route = this.route.slice(0, -1);

    const regex = /(\?|\&)([^=]+)\=([^&]+)/;
    const params = regex.exec(location.href);

    if(params !== null) {
      let thisParam = params[0].replace("#", "");
      if (thisParam !== this.currentParam) {
        if (location.hash === "")
          this.route += thisParam;
        this.currentParam = thisParam;
      }
    }

    let newCurrentPage = await Object.values(this.routes).find(
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

