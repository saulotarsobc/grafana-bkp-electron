const server_list = document.querySelector('#server_list');
const server_selected = document.querySelector('#server_selected');
const dashboards_list = document.querySelector('#dashboards_list');
const selectAllDashs = document.querySelector('#selectAllDashs');
const getDashSelected = document.querySelector('#getDashSelected');
const unselectAllDashs = document.querySelector('#unselectAllDashs');
const saveDashDownloaded = document.querySelector('#saveDashDownloaded');

/* server */
let nameG, addressG, tokenG, dashsOfGrafana;
let DASHS_DOWNLOADED = [];
/* server */

/* set status */
function setNotDownloadedAll() {
  document.querySelectorAll(`div.status`).forEach(el => {
    el.innerHTML = "Não baixado";
    el.classList.add("not-downloaded");
    el.classList.remove("save-success");
    el.classList.remove("save-fail");
    el.classList.remove("downloaded");
  });
};
function setDownloaded(uid) {
  const el = document.querySelector(`div.status[data-uid="${uid}"]`);
  el.innerHTML = "Baixado";
  el.classList.add("downloaded");
  el.classList.remove("save-success");
  el.classList.remove("save-fail");
  el.classList.remove("not-downloaded");
};
function setNotDownloaded(uid) {
  const el = document.querySelector(`div.status[data-uid="${uid}"]`);
  el.innerHTML = "Não baixado";
  el.classList.add("not-downloaded");
  el.classList.remove("save-success");
  el.classList.remove("save-fail");
  el.classList.remove("downloaded");
}
function setSaved(uid) {
  const el = document.querySelector(`div.status[data-uid="${uid}"]`);
  el.innerHTML = "Salvo";
  el.classList.add("save-success");
  el.classList.remove("save-fail");
  el.classList.remove("not-downloaded");
  el.classList.remove("downloaded");
};
function setNotSaved(uid) {
  const el = document.querySelector(`div.status[data-uid="${uid}"]`);
  el.innerHTML = "Não salvo";
  el.classList.add("save-fail");
  el.classList.remove("save-success");
  el.classList.remove("not-downloaded");
  el.classList.remove("downloaded");
};
/* set status */

/* listeners */
getDashSelected.addEventListener('click', () => {

  DASHS_DOWNLOADED = [];

  setNotDownloadedAll();

  const dashsSelected = getSelectedDashs();
  dashsSelected.forEach(async ({ title, uid }) => {
    const { dashboard } = await getDashboardFetc(uid);

    if (dashboard) {
      DASHS_DOWNLOADED.push({ title, dashboard });
      setDownloaded(uid);
    }
    else {
      setNotDownloaded(uid);
    }
  });
});

selectAllDashs.addEventListener('click', () => {
  setNotDownloadedAll();
  document.querySelectorAll(".select_download").forEach((el) => {
    el.checked = true;
  });
});

unselectAllDashs.addEventListener('click', () => {
  setNotDownloadedAll();
  document.querySelectorAll(".select_download").forEach((el) => {
    el.checked = false;
  });
});

saveDashDownloaded.addEventListener('click', () => {
  if (DASHS_DOWNLOADED.length < 1) {
    alert('Nenhuma dashboard baixada!');
  } else {
    ipcRenderer.send('DASHS_DOWNLOADED', DASHS_DOWNLOADED)
    console.log(DASHS_DOWNLOADED);
  }
});

ipcRenderer.on('saveAnd', (e, { success, title, dashboard, message, error }) => {
  if (success) {
    setSaved(dashboard.uid);
    console.log(message);
  }
  else {
    setNotSaved(dashboard.uid);
    console.log(message, error);
  }
});
/* listeners */

const getListServerOfDb = async () => {
  const servers = await Servers.findAll({ raw: true });

  server_list.innerHTML = ``;

  servers.map(({ id, name }) => {
    server_list.innerHTML += `<div class="server" data-severID="${id}">
        <div class="server_name_btn server_props">
          <button data-server_target="${id}"><i class="uil uil-play"></i></button>
        </div>
        <div class="server_id server_props">${id}</div>
        <div class="server_name server_props">${name}</div>
      </div>`
  });

  document.querySelectorAll("div.server_name_btn.server_props > button").forEach((el) => {
    el.addEventListener('click', () => {
      const { server_target } = el.dataset;
      getSearchByServer(server_target);
      document.querySelector("body > nav > div:nth-child(2)").click();
    });
  });

};

const getSearchByServer = async (server_target) => {
  const { name, address, token } = await Servers.findOne({ where: { id: server_target }, raw: true }).then(data => { return data });

  nameG = name;
  addressG = address;
  tokenG = token;

  server_selected.innerHTML = name;
  const search = await getSearchFetch(address, token);

  if (search) {
    dashboards_list.innerHTML = ``;

    search.map(({ uid, title, type, tags }) => {
      if (type == "dash-db") {
        dashboards_list.innerHTML += `<div class="dash">
              <div class="select_download_wrap">
                <input data-title="${title}" data-uid="${uid}" data-type="${type}" class="select_download" type="checkbox" name="${uid}" id="${uid}" />
              </div>
              <div class="title">${title}</div>
              <div class="status not-downloaded" data-uid="${uid}">Não baixado</div>
            </div>`;
      }
    });
  }
};

const getSearchFetch = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${tokenG}`);

  return await fetch(`${addressG}/api/search`, { method: 'GET', headers: myHeaders, redirect: 'manual' })
    .then(response => response.json())
    .catch(error => console.log('error', error));
};

const getDashboardFetc = async (uid) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${tokenG}`);

  return await fetch(`${addressG}/api/dashboards/uid/${uid}`, { method: 'GET', headers: myHeaders, redirect: 'manual' })
    .then(response => response.json())
    .catch(error => console.log('error', error));
};

const getSelectedDashs = () => {
  let data = [];
  document.querySelectorAll(".select_download:checked").forEach((el) => data.push(el.dataset));
  return data;
};

/* init */
// getSearchByServer(1);
getListServerOfDb();