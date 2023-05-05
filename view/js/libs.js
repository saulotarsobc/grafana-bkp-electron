const { ipcRenderer } = require('electron');
const { Sequelize, DataTypes } = require("sequelize");
const { join } = require("path");
const remote = require("@electron/remote");