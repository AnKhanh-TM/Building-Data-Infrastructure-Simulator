export const GAME_CONTENT = {
  step2: {
    title: 'Bước 1: Data Sources',
    sources: [
      { id: 'ga4', label: 'Google Analytics (GA4)', icon: '📊', correct: true, reason: 'Theo dõi hành vi người dùng trên web, phễu mua hàng và nguồn truy cập.' },
      { id: 'crm', label: 'Hệ thống Đơn hàng (Order)', icon: '🛒', correct: true, reason: 'Lưu trữ lịch sử mua hàng, giá trị đơn và trạng thái thanh toán.' },
      { id: 'pos', label: 'Hệ thống Offline (POS)', icon: '🏪', correct: true, reason: 'Đồng bộ dữ liệu mua hàng tại cửa hàng để có cái nhìn toàn diện (Omnichannel).' },
      { id: 'ads', label: 'Facebook / Google Ads', icon: '🎯', correct: false, reason: 'Chỉ cung cấp dữ liệu quảng cáo (Reach/Click), không phản ánh thói quen mua hàng thực tế.' },
      { id: 'email', label: 'Email Marketing', icon: '✉️', correct: false, reason: 'Chỉ là kênh tương tác, không phải nguồn dữ liệu gốc về hành vi người dùng.' },
      { id: 'heatmap', label: 'Website Heatmap', icon: '🔥', correct: false, reason: 'Quá chi tiết vào vị trí bấm chuột, không cần thiết cho mục tiêu chiến lược tổng thể.' },
    ],
    questions: [
      { id: 'q_a', text: 'Hành vi trên web & Nguồn mang lại khách hàng?' },
      { id: 'q_b', text: 'Lịch sử mua hàng & Giá trị vòng đời khách hàng?' },
      { id: 'q_c', text: 'Dữ liệu mua hàng tại quầy & Khách hàng offline?' },
    ],
    correctMappings: {
      ga4: 'q_a',
      crm: 'q_b',
      pos: 'q_c',
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
      { id: 'excel', text: 'Xuất ra file Excel để lưu trữ thủ công' },
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
    wrongMetrics: ['attendance', 'uptime', 'likes', 'cpu']
  }
};
