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
 *
 */
document.addEventListener('dataLoaded', (event: Event) => {

  console.log(
      "  ╔╦═══╦═══╦═══╦═══╦═══╦═╗ ╔╗\n" +
      "  ║║╔═╗║╔═╗╠╗╔╗║╔═╗║╔═╗║║╚╗║║\n" +
      "  ║║║ ║║╚═╝║║║║║╚══╣║ ║║╔╗╚╝║\n" +
      "╔╗║║║ ║║╔╗╔╝║║║╠══╗║║ ║║║╚╗║║\n" +
      "║╚╝║╚═╝║║║╚╦╝╚╝║╚═╝║╚═╝║║ ║║║\n" +
      "╚══╩═══╩╝╚═╩═══╩═══╩═══╩╝ ╚═╝ is ready to go!\n")

  loadNotifications()

  /**
   * Manage Custom Events
   */
  customDataLoadedEvents(event);
})

/**
 *
 */
document.addEventListener('htmlLoaded', (event: Event) => {

  /**
   * Manage Custom Events
   */
  customHtmlLoadedEvents(event);

})

/**
 * Manage ALL click events
 * Do not add new elements in this Function, use "customClickEvents" to add new click event matches
 */
document.addEventListener("click", async (event: Event) => {

  let elementTarget:Element = event.target as Element;
  let HyperlinkElement:HTMLHyperlinkElementUtils = elementTarget.closest("A") as HTMLHyperlinkElementUtils;

  /**
   * Manage internal Links
   * Link like "/my-link" doesn't reload page, just the body content.
   */
  if( elementTarget.closest("A") &&
      HyperlinkElement.hostname === location.hostname &&
      !HyperlinkElement.href.includes("#")
  ) {
    event.preventDefault();
    document.location.href = HyperlinkElement.pathname.replace("/", "#");
  }

  /**
   * Manage Anchors
   * Create link with this attribute : data-anchor="targetId" (replace targetId by the element ID was targeting)
   */
  if (elementTarget.matches("[data-anchor]")) {
    event.preventDefault();
    document
      .getElementById(elementTarget.closest("[data-anchor]").attributes["data-anchor"].value)
      .scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Manage Notifications
   */
  if(elementTarget.closest("[data-notification]")){
    hideNotification(elementTarget.closest("[data-notification]").attributes["data-notification"].value)
  }

  /**
   * Manage Forms
   */
  if (elementTarget.closest('[type="submit"]')){
    event.preventDefault();
    checkFormRules(elementTarget.closest('form'));
  }


  /**
   * Manage Data-Actions
   * Management of scripts triggered by "data-action" html tags
   */
  if(elementTarget.hasAttribute('data-action')){

   //

  }

  /**
   * Manage Custom Events
   */
  customClickEvents(event);
});

