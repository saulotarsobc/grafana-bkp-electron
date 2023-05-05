const server_list = document.querySelector('#server_list');
const server_selected = document.querySelector('#server_selected');


const getListServerOfDb = async () => {
    const servers = await Servers.findAll({ raw: true });

    server_list.innerHTML = ``;

    servers.map(({ id, name }) => {
        server_list.innerHTML += `<div class="server" data-severID="${id}">
        <div class="server_name_btn server_props">
          <button data-server_target="${id}" data-server_name="${name}"><i class="uil uil-play"></i></button>
        </div>
        <div class="server_id server_props">${id}</div>
        <div class="server_name server_props">${name}</div>
      </div>`
    });

    document.querySelectorAll("div.server_name_btn.server_props > button").forEach((el) => {
        el.addEventListener('click', () => {
            const { server_target, server_name } = el.dataset;
            getSearchByServer(server_target)
            server_selected.innerHTML = server_name;
            document.querySelector("body > nav > div:nth-child(2)").click();
        });
    });

}

const getSearchByServer = async (id) => {
    const { address, token } = await Servers.findOne({ where: { id }, raw: true }).then(data => { return data });

    const search = await getSearch(address, token);

    console.log(search);
    search.forEach(el => {
        console.log(el)
    });
};

const getSearch = async (address, token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    return await fetch(`${address}/api/search`, { method: 'GET', headers: myHeaders, redirect: 'manual' })
        .then(response => response.json())
        .catch(error => console.log('error', error));
};

const getDashboard = async (address, token, uid) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    return await fetch(`${address}/api/dashboards/uid/${uid}`, { method: 'GET', headers: myHeaders, redirect: 'manual' })
        .then(response => response.json())
        .catch(error => console.log('error', error));
};

/* init */
getListServerOfDb();