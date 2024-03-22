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
          const SoDienThoai = req.body.phone;
          const Password = req.body.password;
          const hashedPassword = await userServices.hashPassword(Password);
          const Avatar = req.file ? req.file.originalname : null;
          const existingUser = await DocGia.findOne({ SoDienThoai });
          if (existingUser) {
            return res.json({ error: "Người dùng đã tồn tại" });
          } else {
            const newDocGia = new DocGia({
              HoLot,
              Ten,
              NgaySinh,
              Phai,
              DiaChi,
              SoDienThoai,
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
    const SoDienThoai = req.body.phone;
    const Password = req.body.password;
    try {
      const existingUser = await DocGia.findOne({ SoDienThoai });
      if (!existingUser) {
        return res.send({ error: "Tài khoản không tồn tại" });
      } else {
        const checkPassword = await userServices.checkPassword(
          Password,
          existingUser.Password
        );
        if (!checkPassword) {
          return res.send({ error: "Sai mật khẩu" });
        } else {
          return res.send({
            message: "Đăng nhập thành công",
            data: existingUser,
          });
        }
      }
    } catch (error) {
      console.log("Lỗi khi đăng nhập", error);
      res.status(500).json({ message: "Lôi khi đăng nhập" });
    }
  }

  async loginStaff(req, res, next) {
    const SoDienThoai = req.body.phone;
    const Password = req.body.password;
    try {
      const existingUser = await NhanVien.findOne({ SoDienThoai });
      if (!existingUser) {
        return res.send({ error: "Tài khoản không tồn tại" });
      } else {
        const checkPassword = await userServices.checkPassword(
          Password,
          existingUser.Password
        );
        if (!checkPassword) {
          return res.send({ error: "Sai mật khẩu" });
        } else {
          return res.send({
            message: "Đăng nhập thành công",
            data: existingUser,
          });
        }
      }
    } catch (error) {
      console.log("Lỗi khi đăng nhập", error);
      res.status(500).json({ message: "Lôi khi đăng nhập" });
    }
  }

  logout(req, res, next) {
    return res.send("Dang xuat");
  }

  // inforUser(req, res, next) {
  //     // const id = req.params.id;
  //     DocGia.find()
  //         // .then(DocGia => res.send({ DocGia: multipleMongoseToObject(DocGia) })
  //         // )
  //         .then(DocGia => res.send(DocGia)
  //         )

  //         .catch((err) => {
  //             console.error('Lỗi khi tìm kiếm khách hàng:', err);
  //         });
  // }

  inforUser(req, res, next) {
    const id = req.params.id;
    DocGia.findById(id)
      .then((DocGia) => res.send(DocGia))

      .catch((err) => {
        console.error("Lỗi khi tìm kiếm khách hàng:", err);
      });
  }
  editProfile(req, res, next) {
    const upload = multer({ storage: storage }).single("image");

    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi tải lên tệp" });
      } else {
        try {
          const id = req.params.id;
          const existingProduct = await DocGia.findById(id);
          if (existingProduct) {
            const HoTenKH = req.body.name;
            const SoDienThoai = req.body.phone;
            const DiaChi = req.body.address;
            if (req.file) {
              const AnhDaiDien = req.file.originalname;
              existingProduct.HoTenKH = HoTenKH;
              existingProduct.SoDienThoai = SoDienThoai;
              existingProduct.DiaChi = DiaChi;
              existingProduct.AnhDaiDien = AnhDaiDien;
              await existingProduct.save();
              return res.json({ message: "Thông tin đã được cập nhật" });
            } else {
              existingProduct.HoTenKH = HoTenKH;
              existingProduct.SoDienThoai = SoDienThoai;
              existingProduct.DiaChi = DiaChi;
              await existingProduct.save();
              return res.json({ message: "Thông tin đã được cập nhật" });
            }
          } else {
            return res.send({ error: "Cập nhật thất bại" });
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật thức uống", error);
          res.status(500).json({ message: "Lỗi khi cập nhật thức uống" });
        }
      }
    });
  }

  inforStaff(req, res, next) {
    const id = req.params.id;
    NhanVien.findById(id)
      .then((nhanvien) => res.send(nhanvien))

      .catch((err) => {
        console.error("Lỗi khi tìm kiếm khách hàng:", err);
      });
  }

  editProfileStaff(req, res, next) {
    const upload = multer({ storage: storage }).single("image");

    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi tải lên tệp" });
      } else {
        try {
          const id = req.params.id;
          const existingProduct = await NhanVien.findById(id);
          if (existingProduct) {
            const HoTenNV = req.body.name;
            const SoDienThoai = req.body.phone;
            const DiaChi = req.body.address;
            const ChucVu = req.body.chucvu;
            if (req.file) {
              const AnhDaiDien = req.file.originalname;
              existingProduct.HoTenNV = HoTenNV;
              existingProduct.SoDienThoai = SoDienThoai;
              existingProduct.ChucVu = ChucVu;
              existingProduct.DiaChi = DiaChi;
              existingProduct.AnhDaiDien = AnhDaiDien;
              await existingProduct.save();
              return res.json({ message: "Thông tin đã được cập nhật" });
            } else {
              existingProduct.HoTenNV = HoTenNV;
              existingProduct.SoDienThoai = SoDienThoai;
              existingProduct.ChucVu = ChucVu;
              existingProduct.DiaChi = DiaChi;
              await existingProduct.save();
              return res.json({ message: "Thông tin đã được cập nhật" });
            }
          } else {
            return res.send({ error: "Cập nhật thất bại" });
          }
        } catch (error) {
          console.log("Lỗi khi cập nhật thức uống", error);
          res.status(500).json({ message: "Lỗi khi cập nhật thức uống" });
        }
      }
    });
  }

  async dashboard(req, res, next) {}
}

module.exports = new Authentication();
