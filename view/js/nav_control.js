const nav_items = document.querySelectorAll('div.nav_item');
const contents = document.querySelectorAll('.content');
const line = document.querySelector('.line');

nav_items?.forEach(nav_item => {
    nav_item?.addEventListener('click', (e) => {

        const { target } = nav_item.dataset;
        nav_items?.forEach((nav_item) => nav_item.classList.remove('active'));
        contents?.forEach((content) => content.classList.remove('active'));

        document.querySelector(`#${target}`).classList.add("active");
        nav_item.classList.add("active");

        if (e.target.tagName == "I") {
            line.style.width = e.target.parentElement.offsetWidth + 'px';
            line.style.left = e.target.parentElement.offsetLeft + 'px';
        } else {
            line.style.width = e.target.offsetWidth + 'px';
            line.style.left = e.target.offsetLeft + 'px';
        }
    });
});