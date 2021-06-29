/**
 *
 */
document.addEventListener('dbReady', event => {

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
  customDbReadyEvents(event);
})

/**
 *
 */
document.addEventListener('pageChange', event => {

  /**
   * Manage Custom Events
   */
  customPageChangeEvents(event);
})

/**
 * Manage ALL click events
 * Do not add new elements in this Function, use "customClickEvents" to add new click event matches
 */
document.addEventListener("click", async event => {

  /**
   * Manage internal Links
   * Link like "/my-link" doesn't reload page, just the body content.
   */
  if(
    event.target.closest("A") &&
    event.target.closest("A").hostname === location.hostname &&
    !event.target.closest("A").href.includes("#")
  ) {
    event.preventDefault();
    document.location.href = event.target.closest("A").pathname.replace("/", "#");
  }

  /**
   * Manage Anchors
   * Create link with this attribute : data-anchor="targetId" (replace targetId by the element ID was targeting)
   */
  if (event.target.matches("[data-anchor]")) {
    event.preventDefault();
    document
      .getElementById(event.target.closest("[data-anchor]").attributes["data-anchor"].value)
      .scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Manage Notifications
   */
  if( event.target.closest("[data-notification]")){
    hideNotification(e.target.closest("[data-notification]").attributes["data-notification"].value)
  }

  /**
   * Manage Forms
   */
  if (event.target.closest('[type="submit"]')){
    event.preventDefault();
    checkFormRules(event.target.closest('form'));
  }


  /**
   * Manage Data-Actions
   * Management of scripts triggered by "data-action" html tags
   */
  if(event.target.hasAttribute('data-action')){

   //

  }

  /**
   * Manage Custom Events
   */
  customClickEvents(event);
});

