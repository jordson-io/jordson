const dataLoaded:Event = new CustomEvent("dataLoaded", { bubbles: true });
const htmlLoaded:Event = new CustomEvent("htmlLoaded", { bubbles: true });
let htmlData:HTMLElement = document.createElement("html");

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
    let collections:string[] = ["pages"];
    let routesList:RoutesList = {};
    let promises:unknown[] = [];

    const getHtml:unknown = new Promise<string>( async resolve => {
        const getHtmlData:unknown = await fetch("assets/app.html");
        resolve(getHtmlData.text());
    })

    for (let i:number = 0; i < collections.length; i++) {
        promises[i] = new Promise<object>( async resolve => {
            const fetchRes:unknown = await fetch(`/api?action=get&name=${collections[i]}`);
            const result:object = fetchRes.json();
            resolve(result);
        })
    }

    htmlData.innerHTML = await getHtml;
    let promiseResult:object[] = await Promise.all(promises);

    for (let i:number = 0; i < promiseResult.length; i++) {
        for (let y:number = 0; y < promiseResult[i].length; y++){
            routesList[(i * promiseResult[i].length + y).toString()] = {
                slug: promiseResult[i][y].slug,
                fileName: promiseResult[i][y].fileName,
                title: promiseResult[i][y].title
            }
        }
    }

    new Router(routesList);
    document.dispatchEvent(dataLoaded);

    /**
     * Manage history and back to prev page
     */
    window.onpopstate = event => {
        let dataID:string = "";

        for (const [key, value] of Object.entries(routesList)) {
            if(value.slug === document.location.pathname.replace("/", ""))
                dataID = value.fileName;
        }

        if(event.state !== null){
            document.getElementById("content")!.innerHTML = htmlData.querySelector(`[data-id='${dataID}']`)!.innerHTML;
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.dispatchEvent(htmlLoaded);
            }, 100);
        }
    };

})();