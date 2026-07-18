import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductList from './components/ProductList'
import ProductModal from './components/ProductModal'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  createdAt: string
}

const API_URL = 'https://go-shop.giaquyen.click/api'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`)
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      alert('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này?')) return
    try {
      await axios.delete(`${API_URL}/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Xoá thất bại')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setTimeout(fetchProducts, 300)
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="title">🛒 Product Manager</h1>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            + Thêm sản phẩm mới
          </button>
        </div>
      </nav>

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        apiUrl={API_URL}
      />
    </div>
  )
}

export default App