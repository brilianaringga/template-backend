const express = require("express");
const router = express.Router();
const ActiveDirectory = require("activedirectory2").promiseWrapper;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const config = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_BASEDN,
  username: process.env.LDAP_ADMIN_USER,
  password: process.env.LDAP_ADMIN_PASSWORD,
  attributes: {
    user: [
      "dn",
      "distinguishedName",
      "userPrincipalName",
      "sAMAccountName",
      "mail",
      "lockoutTime",
      "whenCreated",
      "pwdLastSet",
      "userAccountControl",
      "employeeID",
      "sn",
      "givenName",
      "initials",
      "cn",
      "displayName",
      "comment",
      "description",
      "extensionAttribute1",
      "title",
    ],
    group: [
      "dn",
      "cn",
      "description",
      "distinguishedName",
      "objectCategory",
      "extensionAttribute1",
      "title",
    ],
  },
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const ad = new ActiveDirectory(config);

  try {
    const findResp = await ad.findUser(username);

    if (!findResp) {
      return res
        .status(401)
        .send("Login failed. Check your username or password");
    }

    const {
      givenName,
      sn,
      extensionAttribute1,
      title,
      description,
      dn,
    } = findResp;

    const user = {
      firstName: givenName,
      lastName: sn,
      employeeId: extensionAttribute1,
      title: title,
      department: description,
    };

    const auth = await ad.authenticate(dn, password);
    if (!auth) {
      return res
        .status(401)
        .send("Login failed. Check your username or password");
    }

    const token = jwt.sign(
      { name: username, role: title },
      process.env.SECRET_TOKEN,
      { expiresIn: "3h", subject: "puzzle" }
    );
    res
      .cookie("SESSIONID", token, { httpOnly: true, secure: true })
      .header("auth-token", token)
      .send(user);
  } catch (error) {
    console.log("ERROR: " + JSON.stringify(error));
    res.status(401).send("Login failed. Check your username or password");
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username } = req.body;
    const ad = new ActiveDirectory(config);

    const employee = await ad.findUser(username);
    const {
      givenName,
      sn,
      extensionAttribute1,
      title,
      description,
      dn,
    } = employee;

    const newUser = new User({
      userName: username,
      firstName: givenName,
      lastName: sn,
      employeeId: extensionAttribute1,
      title: title,
      department: description,
    });

    await newUser.save();

    res.send({
      status: "success",
      code: 200,
      message: `User ${username.toUpperCase()} has been created`,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
