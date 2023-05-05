const dbFile = join(remote.app.getPath("userData"), "dbFile.sqlite"); //console.log(dbFile);
const sequelize = new Sequelize({ dialect: "sqlite", storage: dbFile });
const Servers = sequelize.define("servers", { name: { type: DataTypes.STRING }, address: { type: DataTypes.STRING }, token: { type: DataTypes.STRING } });
Servers.sync({ alter: true });