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


const dataLoaded: Event = new CustomEvent("dataLoaded", {bubbles: true});
const htmlLoaded: Event = new CustomEvent("htmlLoaded", {bubbles: true});
let htmlData: HTMLElement = document.createElement("html");
let pagesRoutes: unknown;

type Route = {
    slug: string;
    fileName: string;
    title: string;
}

type RoutesList = {
    [key: string]: Route;
}

/**
 * Init website
 * @type {HTMLDivElement}
 */
(async () => {

    /**
     * Load Routes List and app.html
     */
    let collections: string[] = ["pages"];
    let routesList: RoutesList = {};
    let promises: unknown[] = [];

    const getHtml: unknown = new Promise<string>(async (resolve: (value: (PromiseLike<string> | string)) => void) => {
        const getHtmlData: Response = await fetch("assets/app.html");
        resolve(getHtmlData.text());
    })

    for (let i: number = 0; i < collections.length; i++) {
        promises[i] = new Promise<object>(async (resolve: (value: (PromiseLike<object> | object)) => void) => {
            const fetchRes: Response = await fetch(`/api?action=get&name=${collections[i]}`);
            const result: object = fetchRes.json();
            resolve(result);
        })
    }

    htmlData.innerHTML = await getHtml;
    let promiseResult: object[] = await Promise.all(promises);

    for (let i: number = 0; i < promiseResult.length; i++) {
        for (let y: number = 0; y < promiseResult[i].length; y++) {
            routesList[(i * promiseResult[i].length + y).toString()] = {
                slug: promiseResult[i][y].slug,
                fileName: promiseResult[i][y].fileName,
                title: promiseResult[i][y].title
            }
        }
    }

    pagesRoutes = new Router(routesList);
    document.dispatchEvent(dataLoaded);

    /**
     * Manage history and back to prev page
     */
    window.onpopstate = event => {
        let dataID: string = "";

        for (const [key, value] of Object.entries(routesList)) {
            if (value.slug === document.location.pathname.replace("/", ""))
                dataID = value.fileName;
        }

        if (event.state !== null) {
            document.getElementById("content")!.innerHTML = htmlData.querySelector(`[data-id='${dataID}']`)!.innerHTML;
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.dispatchEvent(htmlLoaded);
            }, 100);
        }
    };

})();