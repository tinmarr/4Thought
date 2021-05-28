if (window.location.protocol == "http:" && window.location.hostname != "localhost") {
    window.location.href = `https://${window.location.hostname}${window.location.pathname}`;
}
