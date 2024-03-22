const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocGia = new Schema({
  HoLot: { type: String, maxLength: 255 },
  Ten: { type: String, maxLength: 255 },
  NgaySinh: { type: String, maxLength: 255 },
  Phai: { type: Number },
  DiaChi: { type: String, maxLength: 255 },
  DienThoai: { type: String, maxLength: 255 },
  AnhDaiDien: { type: String, maxLength: 255 },
});

module.exports = mongoose.model("DocGia", DocGia);
