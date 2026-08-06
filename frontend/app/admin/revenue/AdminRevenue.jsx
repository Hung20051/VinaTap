"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Download, Trash2, X } from "lucide-react";
import { manualSaleAPI, provinceAPI } from "@/lib/api";
import { getToken } from "../../../lib/auth";
import "./AdminRevenue.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminRevenue() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    load();
    loadProducts();
  }, []);

  const load = async (searchValue = search) => {
    setLoading(true);
    try {
      const res = await manualSaleAPI.getAll({ search: searchValue });
      setSales(res.sales);
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách đơn", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const provRes = await provinceAPI.getAll(true);
      const provList = provRes.provinces || [];

      const presetCombos = [
        {
          id: "combo-full",
          name: "Bộ Combo 34 Tỉnh Thành VinaTap (Full Box)",
          default_price: 4500000,
          category: "Combo",
        },
        {
          id: "combo-10",
          name: "Bộ Combo 10 Tỉnh Thành Du Lịch Nổi Bật",
          default_price: 1400000,
          category: "Combo",
        },
        {
          id: "combo-north",
          name: "Bộ Combo 5 Tỉnh Thành Miền Bắc",
          default_price: 700000,
          category: "Combo",
        },
        {
          id: "combo-central",
          name: "Bộ Combo 5 Tỉnh Thành Miền Trung",
          default_price: 700000,
          category: "Combo",
        },
        {
          id: "combo-south",
          name: "Bộ Combo 5 Tỉnh Thành Miền Nam",
          default_price: 700000,
          category: "Combo",
        },
        {
          id: "custom-piece",
          name: "Thẻ Mảnh Lẻ NFC Tự Chọn (150.000đ)",
          default_price: 150000,
          category: "Combo",
        },
      ];

      const provincePieces = provList.map((p) => ({
        id: `prov-${p.id}`,
        name: `Thẻ Mảnh Lẻ NFC ${p.name}`,
        default_price: 150000,
        category: "Tỉnh Thành",
      }));

      setProducts([...presetCombos, ...provincePieces]);
    } catch (err) {
      console.error("loadProducts error:", err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load(search);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEditForm = (sale) => {
    setEditingId(sale.id);
    setForm({
      product_id: sale.product_id || "",
      product_name_snapshot: sale.product_name_snapshot,
      unit_price: sale.unit_price,
      quantity: sale.quantity,
      buyer_name: sale.buyer_name,
      note: sale.note || "",
    });
    setFormOpen(true);
  };

  // Chọn sản phẩm trong dropdown -> tự điền giá gợi ý (default_price),
  // nhưng admin vẫn sửa được unit_price sau đó (voucher/mua sỉ)
  const handleProductChange = (productId) => {
    const product = products.find((p) => String(p.id) === String(productId));
    setForm((f) => ({
      ...f,
      product_id: productId,
      product_name_snapshot: product?.name || f.product_name_snapshot,
      unit_price: product ? product.default_price : f.unit_price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.buyer_name.trim())
      return showToast("Vui lòng nhập tên người mua", "error");
    if (!form.product_name_snapshot.trim())
      return showToast("Vui lòng chọn hoặc nhập tên sản phẩm", "error");
    if (!form.quantity || Number(form.quantity) < 1)
      return showToast("Số lượng phải lớn hơn 0", "error");
    if (form.unit_price === "" || Number(form.unit_price) < 0)
      return showToast("Đơn giá không hợp lệ", "error");

    try {
      const isNumericId = form.product_id && !isNaN(form.product_id);
      const body = {
        product_id: isNumericId ? Number(form.product_id) : null,
        product_name_snapshot: form.product_name_snapshot.trim(),
        unit_price: Number(form.unit_price),
        quantity: Number(form.quantity),
        buyer_name: form.buyer_name.trim(),
        note: form.note ? form.note.trim() : null,
      };

      if (editingId) {
        await manualSaleAPI.update(editingId, body);
        showToast("Đã cập nhật đơn");
      } else {
        const res = await manualSaleAPI.create(body);
        showToast(`Đã tạo đơn ${res.sale.sale_code}`);
      }

      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Lỗi lưu đơn", "error");
    }
  };

  const handleDelete = async (sale) => {
    if (!confirm(`Xóa đơn ${sale.sale_code}? (vẫn khôi phục được trong DB)`))
      return;
    try {
      await manualSaleAPI.delete(sale.id);
      showToast("Đã xóa đơn");
      load();
    } catch (err) {
      showToast(err.message || "Lỗi xóa đơn", "error");
    }
  };

  // Không dùng thẻ <a href> trực tiếp vì route yêu cầu Authorization
  // header (JWT) — trình duyệt không tự đính kèm header khi tải file qua
  // link thường, nên phải tự fetch rồi tạo blob URL để tải xuống.
  const handleExport = async () => {
    try {
      const token = getToken();
      const url = manualSaleAPI.exportCsvUrl({ search });
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Xuất file thất bại");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `doanh-thu-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      showToast(err.message || "Lỗi xuất file", "error");
    }
  };

  return (
    <div>
      <div className="admin-rev-header">
        <div>
          <h1 className="admin-dash-title">💰 Doanh thu</h1>
          <p className="admin-dash-subtitle">
            Đơn bán thủ công cho đại lý/khách lẻ
          </p>
        </div>
        <div className="admin-rev-header__actions">
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={16} /> Xuất CSV
          </button>
          <button className="btn btn-primary" onClick={openCreateForm}>
            <Plus size={16} /> Tạo đơn mới
          </button>
        </div>
      </div>

      <form className="admin-rev-search" onSubmit={handleSearchSubmit}>
        <Search size={16} className="admin-rev-search__icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn (HD-000001) hoặc tên người mua..."
          className="admin-rev-search__input"
        />
      </form>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : sales.length === 0 ? (
        <div className="card admin-rev-empty">
          {search ? "Không tìm thấy đơn nào khớp" : "Chưa có đơn bán nào"}
        </div>
      ) : (
        <div className="card admin-rev-table-wrap">
          <table className="admin-rev-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Sản phẩm</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Người mua</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => openEditForm(s)}
                  className="admin-rev-row"
                >
                  <td className="admin-rev-code">{s.sale_code}</td>
                  <td>{s.product_name_snapshot}</td>
                  <td>{s.quantity}</td>
                  <td>{formatVND(s.unit_price)}</td>
                  <td className="admin-rev-total">
                    {formatVND(s.total_amount)}
                  </td>
                  <td>{s.buyer_name}</td>
                  <td>{new Date(s.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <button
                      className="admin-rev-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s);
                      }}
                      aria-label="Xóa đơn"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div
          className="admin-rev-modal-backdrop"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="card admin-rev-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-rev-modal__header">
              <h2>{editingId ? "Sửa đơn" : "Tạo đơn mới"}</h2>
              <button onClick={() => setFormOpen(false)} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-rev-form">
              <label className="admin-rev-field">
                <span>Sản Phẩm NFC / Combo</span>
                <select
                  value={form.product_id}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  <option value="">— Nhập tên tự do bên dưới —</option>
                  <optgroup label="📦 GÓI COMBO VINATAP">
                    {products
                      .filter((p) => p.category === "Combo")
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatVND(p.default_price)}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="🗺️ 34 MẢNH LẺ NFC TỈNH THÀNH">
                    {products
                      .filter((p) => p.category === "Tỉnh Thành")
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatVND(p.default_price)}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </label>

              <label className="admin-rev-field">
                <span>Tên sản phẩm (hiển thị trên đơn)</span>
                <input
                  type="text"
                  value={form.product_name_snapshot}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      product_name_snapshot: e.target.value,
                    }))
                  }
                  placeholder="VD: Mảnh lẻ Hải Phòng"
                />
              </label>

              <div className="admin-rev-form-row">
                <label className="admin-rev-field">
                  <span>Số lượng</span>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                  />
                </label>
                <label className="admin-rev-field">
                  <span>Đơn giá (đ)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.unit_price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit_price: e.target.value }))
                    }
                  />
                </label>
              </div>

              <p className="admin-rev-form-total">
                Thành tiền:{" "}
                <strong>
                  {formatVND(
                    Number(form.unit_price || 0) * Number(form.quantity || 0),
                  )}
                </strong>
              </p>

              <label className="admin-rev-field">
                <span>Tên người mua / đại lý</span>
                <input
                  type="text"
                  value={form.buyer_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, buyer_name: e.target.value }))
                  }
                  placeholder="VD: Anh A, Đại lý Hải Phòng..."
                />
              </label>

              <label className="admin-rev-field">
                <span>Ghi chú (tùy chọn)</span>
                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  rows={2}
                />
              </label>

              <div className="admin-rev-modal__footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setFormOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Lưu thay đổi" : "Tạo đơn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-rev-toast admin-rev-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

function emptyForm() {
  return {
    product_id: "",
    product_name_snapshot: "",
    unit_price: "",
    quantity: 1,
    buyer_name: "",
    note: "",
  };
}
