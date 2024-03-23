const DocGia = require("../models/DocGia");
const NhanVien = require("../models/NhanVien");
class CustomerController {
  async listUser(req, res, next) {
    try {
      const user = await DocGia.find();
      return res.send(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async listStaff(req, res, next) {
    try {
      const staff = await NhanVien.find();
      return res.send(staff);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async dashBoard(req, res, next) {
    try {
      const user = await DocGia.countDocuments();
      const staff = await NhanVien.countDocuments();
      const order = await DonHang.find({ TrangthaiDH: { $ne: "D" } });
      const orderPending = await DonHang.find({ TrangthaiDH: "W" });
      return res.json({ user, staff, order, orderPending });
    } catch (error) {
      console.log("Lỗi khi thêm lấy dữ liệu", error);
      res.status(500).json({ message: "Lỗi khi thêm lấy dữ liệu" });
    }
  }
}

module.exports = new CustomerController();
