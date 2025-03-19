const RoleModel = require("../models/RoleModel");

const CreateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const CheckRole = await RoleModel.findOne({ name: name });
    if (CheckRole) {
      return res.send({ message: "Role Already Exists" });
    } else {
      const CreateRole = await RoleModel.create({ name });
      if (CreateRole) {
        res
          .status(201)
          .send({ message: "Role Created Successfully", data: CreateRole });
      } else {
        res.send({ message: "Role Creation Failed" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const GetRoles = async (req, res) => {
  const GetRoles = await RoleModel.find();
  res.status(200).send(GetRoles);
};

module.exports = {
  CreateRole,
  GetRoles,
};
