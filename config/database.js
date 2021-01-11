const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

if (process.env.NODE_ENV == "dev") {
  sequelize.sync({ force: true });
}

module.exports = sequelize;
