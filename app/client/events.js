/**
 * Manage ALL click events
 * Do not add new elements in this Function, use "customEvents" to add new click event matches
 */
document.addEventListener('click', e => {
    /**
     * Manage internal Links
     * Link like "/my-link" doesn't reload page, just the body content.
     */
    if(e.target.nodeName === 'A' && e.target.hostname === location.hostname && !e.target.href.includes('#')){
        e.preventDefault()
        document.location.href = e.target.pathname.replace('/', '#')
    }

    /**
     * Manage Anchors
     * Create link with this attribute : data-anchor="targetId" (replace targetId by the element ID was targeting)
     */
    if(e.target.matches('[data-anchor]')){
        e.preventDefault()
        document.getElementById(e.target.closest('[data-anchor]').attributes['data-anchor'].value).scrollIntoView({behavior: 'smooth'})
    }

    /**
     * Manage Custom Events
     */
    customEvents(e)
})

/**
 * Manage Custom Events
 * @param e Event from eventListenner
 */
function customEvents(e){

}