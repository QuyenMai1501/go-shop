import type { Product } from '../App'

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductList({ products, onEdit, onDelete }: Props) {
  return (
    <div className="product-grid">
      {products.length === 0 && (
        <div style={{ 
          gridColumn: '1 / -1', 
          textAlign: 'center', 
          padding: '4rem 1rem',
          color: '#64748b',
          fontSize: '1.2rem'
        }}>
          Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
        </div>
      )}

      {products.map(product => (
        <div key={product.id} className="product-card">
          {product.image ? (
            <img
              src={`https://go-shop.giaquyen.click${product.image}`}
              alt={product.name}
              className="product-image"
            />
          ) : (
            <div className="no-image">Không có hình ảnh</div>
          )}

          <div className="product-info">
            <div className="product-name">{product.name}</div>
            
            <div className="product-price">
              {product.price.toLocaleString('vi-VN')} ₫
            </div>

            <div className="product-desc">
              {product.description || 'Không có mô tả'}
            </div>

            <div className="card-actions">
              <button className="edit-btn" onClick={() => onEdit(product)}>
                Sửa
              </button>
              <button className="delete-btn" onClick={() => onDelete(product.id)}>
                Xoá
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}