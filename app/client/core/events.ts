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

