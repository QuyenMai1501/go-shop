import { useState, useEffect } from "react";
import axios from "axios";
import type { Product } from "../App";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  apiUrl: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  apiUrl,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buildImageUrl = (value: string | null | undefined) => {
    if (!value) return null;
    return value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://go-shop.giaquyen.click${value}`;
  };

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price.toString(),
        description: product.description || "",
        image: product.image || "",
      });
      setImagePreview(
        product.image.startsWith("http")
          ? product.image
          : `https://go-shop.giaquyen.click${product.image}`,
      );
    } else {
      setForm({ name: "", price: "", description: "", image: "" });
      setImagePreview(null);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Vui lòng nhập tên và giá");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      if (product) {
        await axios.put(`${apiUrl}/products/${product.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${apiUrl}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giá (VND)</label>
              <input
                type="number"
                className="form-input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea
                className="form-textarea"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Đường link hình ảnh</label>
              <input
                type="text"
                className="form-input"
                value={form.image}
                onChange={(e) => {
                  const url = e.target.value;
                  setForm({ ...form, image: url });
                  setImagePreview(buildImageUrl(url));
                }}
                placeholder="https://example.com/image.jpg hoặc https://i.imgur.com/xxx.jpg"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="preview-image"
                />
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Huỷ
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? "Đang xử lý..."
                  : product
                    ? "Cập nhật"
                    : "Thêm sản phẩm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
