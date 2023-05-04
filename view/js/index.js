const { ipcRenderer } = require("electron");
const { Sequelize, DataTypes } = require("sequelize");
const { join } = require("path");
const remote = require("@electron/remote");

const dbFile = join(remote.app.getPath("userData"), "dbFile.sqlite");
const sequelize = new Sequelize({ dialect: "sqlite", storage: dbFile });

const Servers = sequelize.define("servers", { name: { type: DataTypes.STRING }, address: { type: DataTypes.STRING }, token: { type: DataTypes.STRING } });
Servers.sync({ alter: true });

/* elements html */
const guia = document.querySelectorAll('.guia');
/* elements html */

/* listeners */
/* listeners */

/* functions */
const getDashBoards = async () => {
    const data = await fetch();
}
/* functions */