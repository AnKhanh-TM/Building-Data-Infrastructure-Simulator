export const GAME_CONTENT = {
  step2: {
    title: 'Bước 1: Data Sources',
    sources: [
      { id: 'ga4', label: 'Google Analytics (GA4)', icon: '📊' },
      { id: 'crm', label: 'Hệ thống CRM', icon: '👥' },
      { id: 'ads', label: 'Facebook / Google Ads', icon: '🎯' },
      { id: 'pos', label: 'Hệ thống Đơn hàng (POS/ERP)', icon: '🛒' },
      { id: 'email', label: 'Email Marketing', icon: '✉️' },
      { id: 'heatmap', label: 'Website Heatmap', icon: '🔥' },
    ],
    questions: [
      { id: 'q_a', text: 'Funnel mua hàng đang rớt ở bước nào trên website?' },
      { id: 'q_b', text: 'Tỷ lệ khách hàng cũ quay lại mua thêm là bao nhiêu?' },
      { id: 'q_c', text: 'Kênh quảng cáo nào mang lại chi phí trên mỗi đơn hàng rẻ nhất?' },
      { id: 'q_d', text: 'Nhóm khách hàng nào mang lại nhiều doanh thu nhất?' },
      { id: 'q_e', text: 'Tỷ lệ khách hàng mở nhắc nhở khuyến mãi là bao nhiêu?' },
      { id: 'q_f', text: 'Người dùng hay bấm vào banner nào nhiều nhất trên trang chủ?' },
    ],
    correctMappings: {
      ga4: 'q_a',
      crm: 'q_b',
      ads: 'q_c',
      pos: 'q_d',
      email: 'q_e',
      heatmap: 'q_f',
    }
  },
  step3: {
    title: 'Bước 2: Thu thập (Pipeline)',
    correctId: 'pipeline',
    explanation: 'Sau khi biết dữ liệu nằm ở đâu, ta phải có cơ chế thu thập và di chuyển dữ liệu (tự động hóa) về một nơi lưu trữ trung tâm.',
    options: [
      { id: 'dashboard', text: 'Xây dựng Dashboard luôn để sếp xem' },
      { id: 'warehouse', text: 'Tạo ngay các cột dữ liệu trong Data Warehouse' },
      { id: 'pipeline', text: 'Lấy dữ liệu từ các nguồn bằng Data Pipeline' },
    ]
  },
  step4: {
    title: 'Bước 3: Lưu trữ (Warehouse)',
    correctId: 'warehouse',
    explanation: 'Data Warehouse mới là nơi lưu trữ dữ liệu tập trung, được thiết kế tối ưu để sẵn sàng cho việc query phân tích lượng Data lớn.',
    options: [
      { id: 'warehouse', text: 'Đưa vào lưu trữ tại Data Warehouse' },
      { id: 'dashboard', text: 'Đưa thẳng lên Dashboard' },
      { id: 'ml', text: 'Xây dựng Machine Learning Model dự đoán' },
      { id: 'ppt', text: 'Vẽ biểu đồ bằng PowerPoint để báo cáo ngay' },
    ]
  },
  step5: {
    title: 'Bước 4: Data Model',
    explanation: 'Cấu trúc Data Model dạng Star Schema (1 Fact - 2 Dims) giúp kết nối các bảng Orders, Customers và Products để tính toán các chỉ số kinh doanh.',
  },
  step6: {
    title: 'Bước 5: Output (Dashboard)',
    explanation: 'Để tối ưu marketing, manager cần Breakdown theo Phân khúc và Thời gian để thấy xu hướng. Chỉ số vận hành kỹ thuật không nên đưa vào Dashboard kinh doanh.',
    wrongMetrics: ['attendance', 'uptime']
  }
};
