const DocGia = require("../models/DocGia");
const NhanVien = require("../models/NhanVien");
const userServices = require("../../services/userService");
const multer = require("multer");
const storage = require("../../services/uploadImage");

class Authentication {
  async createStaff(req, res, next) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const HoTenNv = req.body.username;
          const Password = req.body.password;
          const DiaChi = req.body.address;
          const SoDienThoai = req.body.phone;
          const hashedPassword = await userServices.hashPassword(Password);
          const ChucVu = req.body.position;
          const Avatar = req.file ? req.file.originalname : null;
          const existingUser = await NhanVien.findOne({ SoDienThoai });
          if (existingUser) {
            return res.json({ error: "Người dùng đã tồn tại" });
          } else {
            const newNhanVien = new NhanVien({
              HoTenNv,
              Password: hashedPassword,
              DiaChi,
              SoDienThoai,
              ChucVu,
              Avatar,
            });
            await newNhanVien.save();
            return res.json({
              message: "Đăng ký nhân viên thành công",
              data: req.body,
            });
          }
        } catch (error) {
          console.log("Lỗi khi đăng ký nhân viên", error.message);
          res.status(500).json({ message: "Lỗi khi đăng ký nhân viên" });
        }
      }
    });
  }

  async createUser(req, res, next) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi tải lên tệp" });
      } else {
        try {
          const HoLot = req.body.lastName;
          const Ten = req.body.username;
          const NgaySinh = req.body.birth;
          const Phai = req.body.sex;
          const DiaChi = req.body.address;
          const DienThoai = req.body.phone;
          const Password = req.body.password;
          const hashedPassword = await userServices.hashPassword(Password);
          const Avatar = req.file ? req.file.originalname : null;
          const existingUser = await DocGia.findOne({ DienThoai });
          if (existingUser) {
            return res.json({ error: "Người dùng đã tồn tại" });
          } else {
            const newDocGia = new DocGia({
              HoLot,
              Ten,
              NgaySinh,
              Phai,
              DiaChi,
              DienThoai,
              Password: hashedPassword,
              Avatar,
            });
            await newDocGia.save();
            return res.json({
              message: "Đăng ký người dùng thành công",
              data: req.body,
            });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async login(req, res, next) {
    const DienThoai = req.body.phone;
    const Password = req.body.password;
    try {
      const existingUser = await DocGia.findOne({ DienThoai });
      if (!existingUser) {
        return res.json({ error: "Tài khoản không tồn tại" });
      } else {
        const checkPassword = await userServices.checkPassword(
          Password,
          existingUser.Password
        );
        if (!checkPassword) {
          return res.json({ error: "Sai mật khẩu" });
        } else {
          const userData = existingUser.toObject();
          delete userData.Password;
          return res.json({
            message: "Đăng nhập thành công",
            data: userData,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async loginStaff(req, res, next) {
    const SoDienThoai = req.body.phone;
    const Password = req.body.password;
    try {
      const existingUser = await NhanVien.findOne({ SoDienThoai });
      if (!existingUser) {
        return res.json({ error: "Tài khoản không tồn tại" });
      } else {
        const checkPassword = await userServices.checkPassword(
          Password,
          existingUser.Password
        );
        if (!checkPassword) {
          return res.json({ error: "Sai mật khẩu" });
        } else {
          const userData = existingUser.toObject();
          delete userData.Password;
          return res.json({
            message: "Đăng nhập thành công",
            data: userData,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  logout(req, res, next) {
    return res.json({ message: "Đăng xuất thành công" });
  }

  infoUser(req, res, next) {
    const id = req.params.id;
    DocGia.findById(id)
      .then((DocGia) => res.send(DocGia))
      .catch((err) => {
        res.send("Lỗi khi tìm kiếm độc giả:");
      });
  }

  editProfile(req, res, next) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const id = req.params.id;
          const existingStaff = await DocGia.findById(id);
          if (existingStaff) {
            const HoLot = req.body.lastName;
            const Ten = req.body.username;
            const NgaySinh = req.body.birth;
            const Phai = req.body.sex;
            const DienThoai = req.body.phone;
            const DiaChi = req.body.address;
            if (req.file) {
              const Avatar = req.file.originalname;
              existingStaff.Avatar = Avatar;
            }
            existingStaff.HoLot = HoLot;
            existingStaff.Ten = Ten;
            existingStaff.NgaySinh = NgaySinh;
            existingStaff.Phai = Phai;
            existingStaff.DienThoai = DienThoai;
            existingStaff.DiaChi = DiaChi;
            await existingStaff.save();
            const userData = existingStaff.toObject();
            delete userData.Password;
            return res.json({
              message: "Thông tin đã được cập nhật",
              data: userData,
            });
          } else {
            return res.json({ error: "Cập nhật thất bại" });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  infoStaff(req, res, next) {
    const id = req.params.id;
    NhanVien.findById(id)
      .then((nhanvien) => res.send(nhanvien))
      .catch((err) => {
        res.status().json("Lỗi khi tìm kiếm nhân viên:", err.message);
      });
  }

  editProfileStaff(req, res, next) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const id = req.params.id;
          const existingStaff = await NhanVien.findById(id);
          if (existingStaff) {
            const HoTenNv = req.body.username;
            const DiaChi = req.body.address;
            const SoDienThoai = req.body.phone;
            const ChucVu = req.body.position;
            const DaiChi = req.body.address;
            if (req.file) {
              const Avatar = req.file.originalname;
              existingStaff.Avatar = Avatar;
            }
            existingStaff.HoTenNv = HoTenNv;
            existingStaff.DiaChi = DiaChi;
            existingStaff.SoDienThoai = SoDienThoai;
            existingStaff.ChucVu = ChucVu;
            existingStaff.DiaChi = DiaChi;
            await existingStaff.save();
            const userData = existingStaff.toObject();
            delete userData.Password;
            return res.json({
              message: "Thông tin đã được cập nhật",
              data: userData,
            });
          } else {
            return res.json({ error: err.message });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async dashboard(req, res, next) {}
}

module.exports = new Authentication();
