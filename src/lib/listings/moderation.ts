export const listingModerationReasons: Array<{ code: string; label: string }> = [
  { code: "missing_information", label: "Thiếu thông tin bắt buộc" },
  { code: "invalid_price", label: "Giá không hợp lệ" },
  { code: "invalid_location", label: "Vị trí không hợp lệ" },
  { code: "duplicate", label: "Trùng tin đã có" },
  { code: "spam_misleading", label: "Spam hoặc nội dung gây hiểu lầm" },
  { code: "prohibited_content", label: "Nội dung vi phạm chính sách" },
  { code: "bad_media_quality", label: "Ảnh/tệp chất lượng kém" },
  { code: "edit_requested", label: "Yêu cầu chỉnh sửa" },
  { code: "suspicious", label: "Nghi vấn gian lận" },
];

export const hideListingReasons: Array<{ code: string; label: string }> = [
  { code: "policy_violation", label: "Vi phạm chính sách" },
  { code: "duplicate", label: "Trùng tin" },
  { code: "suspicious", label: "Nghi vấn gian lận" },
  { code: "prohibited_content", label: "Nội dung vi phạm" },
];
