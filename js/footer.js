const footer = document.getElementById("footer");
const adjustFooterPlacement = () => {
    if (window.innerHeight - 130 < document.body.clientHeight) {
        footer.className = "footer-float";
    } else {
        footer.className = "footer-anchor";
    }
};

export const loadFooterEvents = () => {
    adjustFooterPlacement();
    window.addEventListener("resize", adjustFooterPlacement);
    const observer = new MutationObserver(adjustFooterPlacement);
    observer.observe(document.body, { childList: true, subtree: true });
};