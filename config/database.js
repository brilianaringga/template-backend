const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_DB,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    schema: process.env.DATABASE_SCHEMA,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

if (process.env.NODE_ENV == "dev") {
  try {
    // sequelize.query(`
    //     CREATE SCHEMA IF NOT EXISTS ${process.env.DATABASE_SCHEMA};
    // `);
    // sequelize.query(`
    //     SET SCHEMA ${process.env.DATABASE_SCHEMA};
    // `);
    sequelize.sync({ force: true });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sequelize;
