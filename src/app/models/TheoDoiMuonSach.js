const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TheoDoiMuonSach = new Schema({
  MaDocGia: [{ type: mongoose.Types.ObjectId, ref: "DocGia" }],
  MaSach: [{ type: mongoose.Types.ObjectId, ref: "Sach" }],
  NgayMuon: { type: Date },
  NgayTra: { type: Date },
});

module.exports = mongoose.model("TheoDoiMuonSach", TheoDoiMuonSach);
