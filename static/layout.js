function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const isHidden = sidebar.classList.toggle("hidden");

    document.body.classList.toggle("nav-open", !isHidden);
    document.body.classList.toggle("nav-closed", isHidden);
}

