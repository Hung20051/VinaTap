require("dotenv").config();
const db = require("../config/db");

async function runMasterDatabaseInit() {
  console.log("🔄 Bắt đầu kiểm tra & khởi tạo 100% cấu trúc MySQL Database...");

  try {
    // 1. Khởi tạo & migration bảng ORDERS
    const Order = require("../models/Order");
    await Order.initTable();
    console.log("✅ Bảng `orders` & các cột giao hàng đã sẵn sàng!");

    // 2. Khởi tạo & migration bảng NOTIFICATIONS
    const Notification = require("../models/Notification");
    await Notification.initTable();
    console.log("✅ Bảng `notifications`, `notification_recipients`, `notification_reads` đã sẵn sàng!");

    // 3. Khởi tạo & migration bảng VOUCHERS & USER_VOUCHERS
    const Voucher = require("../models/Voucher");
    await Voucher.initTable();
    console.log("✅ Bảng `vouchers` & `user_vouchers` đã sẵn sàng!");

    // 4. Khởi tạo & migration bảng SYSTEM_SETTINGS
    const SystemSetting = require("../models/SystemSetting");
    await SystemSetting.initTable();
    console.log("✅ Bảng `system_settings` đã sẵn sàng!");

    // 5. Khởi tạo & migration bảng PAGE_VIEWS
    const PageView = require("../models/PageView");
    await PageView.initTable();
    console.log("✅ Bảng `page_views` đã sẵn sàng!");

    // 6. Khởi tạo & migration bảng PRODUCTS
    const Product = require("../models/Product");
    await Product.initTable();
    console.log("✅ Bảng `products` đã sẵn sàng!");

    // 7. Khởi tạo & migration bảng SHIPPING_RULES
    const ShippingRule = require("../models/ShippingRule");
    await ShippingRule.initTable();
    console.log("✅ Bảng `shipping_rules` đã sẵn sàng!");

    console.log("🎉 TOÀN BỘ MYSQL DATABASE VINA TAP ĐÃ ĐƯỢC ĐỒNG BỘ 100% THÀNH CÔNG!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khởi tạo Database:", err);
    process.exit(1);
  }
}

runMasterDatabaseInit();
