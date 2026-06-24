# Data System Builder

Game thực hành cho học viên AI Marketing & Sales System, bám theo flow:

`Business Question → Data Sources → Pipeline → Warehouse → Data Model → Dashboard → Decision`

## Chạy local

```bash
npm install
copy .env.example .env.local
npm run dev
```

Nếu chưa cấu hình webhook, game vẫn hoạt động và lưu bài trên trình duyệt.

## Kết nối Google Sheets

1. Tạo một Google Sheet mới.
2. Mở `Extensions → Apps Script`.
3. Dán nội dung [google-apps-script/Code.gs](google-apps-script/Code.gs) vào `Code.gs`.
4. Chọn `Deploy → New deployment → Web app`.
5. Đặt `Execute as: Me` và `Who has access: Anyone`.
6. Deploy, cấp quyền và sao chép URL kết thúc bằng `/exec`.
7. Đặt biến môi trường:

```env
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Trên Vercel, thêm biến này trong `Project Settings → Environment Variables`, sau đó redeploy.

Apps Script tự tạo tab `Game Submissions` và header khi nhận request đầu tiên. Khóa cập nhật là `email + mã lớp`, nên refresh hoặc gửi lại không tạo thêm dòng. Một dòng được tạo lúc học viên bắt đầu và cập nhật điểm khi hoàn thành.

## Dữ liệu ghi nhận

- Họ tên, email, mã lớp.
- Thời gian bắt đầu và hoàn thành.
- Trạng thái, tổng điểm, điểm từng phần và xếp hạng.
- Số lần làm và submission ID gần nhất.

## Kiểm tra

```bash
npm run lint
npm run build
```
