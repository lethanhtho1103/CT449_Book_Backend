const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");
const DocGia = require("../models/DocGia");
const Sach = require("../models/Sach");
class RentController {
  async addToRent(req, res, next) {
    try {
      const { maDocGia, maSach, ngayMuon, ngayTra, soLuong } = req.body;
      const [existingSach, existingDocGia] = await Promise.all([
        Sach.findById(maSach),
        DocGia.findById(maDocGia),
      ]);
      if (!existingSach) return res.json({ error: "Không tìm thấy sản phẩm" });
      if (!existingDocGia) return res.json({ error: "Không tìm thấy đọc giả" });
      if (soLuong > existingSach.SoQuyen)
        return res.json({ error: "Số lượng hàng không đủ" });
      existingSach.SoQuyen -= soLuong;
      const newTheoDoiMuonSach = await TheoDoiMuonSach.create({
        MaDocGia: maDocGia,
        MaSach: maSach,
        SoLuong: soLuong,
        NgayMuon: ngayMuon,
        NgayTra: ngayTra,
        TrangThai: "R",
      });
      await Promise.all([existingSach.save(), newTheoDoiMuonSach.save()]);
      return res.json({
        message: "Mượn sách thành công",
        data: newTheoDoiMuonSach,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listRentOfUser(req, res, next) {
    try {
      const MaDocGia = req.params.id;
      TheoDoiMuonSach.find({ MaDocGia: MaDocGia })
        .populate("MaSach")
        .then((TheoDoiMuonSachs) => {
          return res.send(TheoDoiMuonSachs);
        })
        .catch((err) => res.json({ message: err.message }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listRentBook(req, res, next) {
    try {
      const MaSach = req.params.id;
      TheoDoiMuonSach.find({ MaSach: MaSach })
        .populate("MaDocGia")
        .then((TheoDoiMuonSachs) => {
          return res.send(TheoDoiMuonSachs);
        })
        .catch((err) => res.json({ message: err.message }));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listRents(req, res, next) {
    try {
      TheoDoiMuonSach.find()
        .populate("MaSach")
        .then((TheoDoiMuonSachs) => {
          return res.send(TheoDoiMuonSachs);
        })
        .catch((err) => res.json({ message: err.message }));
    } catch (error) {
      console.log("Lỗi khi thêm uống", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateRent(req, res, next) {
    try {
      const id = req.params.id;
      const existingRent = await TheoDoiMuonSach.findById(id);
      if (!existingRent) return res.json({ error: "Không tìm thấy id." });

      existingRent.MaDocGia = req.body.maDocGia || existingRent.maDocGia;
      existingRent.MaSach = req.body.maSach || existingRent.MaSach;
      existingRent.NgayMuon = req.body.ngayMuon || existingRent.NgayMuon;
      existingRent.NgayTra = req.body.ngayTra || existingRent.NgayTra;
      existingRent.SoLuong = req.body.soLuong || existingRent.SoLuong;
      existingRent.TrangThai = req.body.trangThai || existingRent.TrangThai;

      await existingRent.save();
      return res.send({ message: "Cập nhật thành công", data: existingRent });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRent(req, res, next) {
    try {
      const id = req.params.id;
      const existingRent = await TheoDoiMuonSach.findById(id);
      if (!existingRent) {
        return res.status(404).json({ error: "Không tìm thấy. " });
      } else {
        await TheoDoiMuonSach.findByIdAndDelete(id);
        return res.send({ message: "Xóa thành công." });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa. " });
    }
  }
}

module.exports = new RentController();
