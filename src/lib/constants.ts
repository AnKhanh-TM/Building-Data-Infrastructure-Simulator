export const BUSINESS_OBJECTIVE =
  'Xác định kênh mang lại khách hàng chất lượng, tạo doanh thu thật và quay lại mua để tối ưu ngân sách Marketing & Sales.';

export const BUSINESS_QUESTIONS = [
  { id: 'quality_channel', label: 'Kênh nào mang lại khách hàng mua nhiều và quay lại?', correct: true },
  { id: 'most_clicks', label: 'Quảng cáo nào có nhiều lượt click nhất tuần này?', correct: false },
  { id: 'server_speed', label: 'Server nào đang phản hồi chậm nhất?', correct: false },
  { id: 'all_dashboard', label: 'Làm một dashboard tổng hợp tất cả số liệu đang có', correct: false },
];

export const MAPPING_TASKS = [
  {
    id: 'revenue_channel',
    question: 'Kênh nào tạo ra revenue thực sự?',
    requiredFields: ['source_campaign', 'order_revenue'],
    requiredSources: ['ga4', 'orders'],
  },
  {
    id: 'repeat_customer',
    question: 'Khách từ kênh nào quay lại mua?',
    requiredFields: ['customer_id', 'order_date', 'source_campaign'],
    requiredSources: ['crm', 'orders', 'ga4'],
  },
  {
    id: 'cac_ltv',
    question: 'CAC có hợp lý so với giá trị khách hàng?',
    requiredFields: ['ad_spend', 'customer_revenue'],
    requiredSources: ['ads', 'orders'],
  },
];

export const FIELD_OPTIONS = [
  ['source_campaign', 'Source / campaign'],
  ['order_revenue', 'Order ID / revenue'],
  ['customer_id', 'Customer ID'],
  ['order_date', 'Order date / repeat flag'],
  ['ad_spend', 'Ad spend'],
  ['customer_revenue', 'Revenue theo customer'],
  ['email_open', 'Email open rate'],
  ['cpu_usage', 'CPU usage'],
] as const;

export const SOURCE_OPTIONS = [
  ['ads', 'Ads Platforms'],
  ['ga4', 'GA4'],
  ['orders', 'Order System'],
  ['crm', 'CRM'],
  ['email', 'Email Automation'],
  ['pos', 'Offline POS'],
] as const;

export const PIPELINE_STEPS = [
  ['extract', 'Extract dữ liệu từ các nguồn'],
  ['transform', 'Làm sạch, chuẩn hóa ID và định dạng'],
  ['load', 'Load dữ liệu vào Data Warehouse'],
  ['model', 'Xây Data Model'],
  ['dashboard', 'Tạo Dashboard để ra quyết định'],
] as const;

export const WAREHOUSE_OPTIONS = [
  { id: 'sheets', label: 'Google Sheets', note: 'Dễ dùng nhưng khó scale và dễ sai lệch.' },
  { id: 'postgres', label: 'PostgreSQL', note: 'Phù hợp MVP nhỏ, không tối ưu analytics lớn.' },
  { id: 'bigquery', label: 'BigQuery', note: 'Setup nhanh, pay-as-you-use, scale tốt và hợp hệ Google.' },
  { id: 'snowflake', label: 'Snowflake', note: 'Scale mạnh nhưng chi phí và governance cao hơn nhu cầu.' },
];

export const MODEL_TABLES = {
  fact_orders: ['order_id', 'customer_id', 'product_id', 'channel_id', 'order_date', 'revenue'],
  dim_customer: ['customer_id', 'segment', 'location', 'first_order_date'],
  dim_product: ['product_id', 'product_name', 'category'],
  dim_channel: ['channel_id', 'source', 'campaign'],
};

export const CORRECT_MODEL_CONNECTIONS = [
  'fact_orders.customer_id>dim_customer.customer_id',
  'fact_orders.product_id>dim_product.product_id',
  'fact_orders.channel_id>dim_channel.channel_id',
];

export const DASHBOARD_OPTIONS = {
  asks: [
    ['quality_channel', 'Kênh nào mang lại khách hàng mua nhiều và quay lại?'],
    ['click_report', 'Kênh nào có nhiều click nhất?'],
    ['server_health', 'Hạ tầng kỹ thuật có ổn định không?'],
  ] as const,
  metrics: [
    ['revenue', 'Revenue theo channel'],
    ['cac', 'CAC'],
    ['ltv', 'LTV'],
    ['repeat_rate', 'Repeat purchase rate'],
    ['roas', 'ROAS'],
    ['clicks', 'Clicks'],
    ['open_rate', 'Email open rate'],
    ['uptime', 'Server uptime'],
  ] as const,
  fields: [
    ['customer_id', 'Customer ID'],
    ['source_campaign', 'Source / campaign'],
    ['order_value', 'Order value'],
    ['order_date', 'Order date'],
    ['ad_spend', 'Ad spend'],
    ['ip_address', 'IP address'],
    ['cpu_usage', 'CPU usage'],
  ] as const,
  breakdowns: [
    ['channel_segment_time', 'Channel + customer segment + thời gian'],
    ['device_ip', 'Device + IP address'],
    ['employee', 'Nhân viên phụ trách'],
  ] as const,
  cadences: [
    ['daily_weekly', 'Cập nhật hằng ngày, review ngân sách hằng tuần'],
    ['realtime', 'Realtime từng giây'],
    ['quarterly', 'Mỗi quý một lần'],
  ] as const,
};
