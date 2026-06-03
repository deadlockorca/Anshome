type StatusBadgeProps = {
  value: string;
};

const statusClassName: Record<string, string> = {
  draft: "border-[#d5dae2] bg-[#f0f2f5] text-[#384052]",
  submitted: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]",
  pending_review: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]",
  published: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]",
  rejected: "border-[#f1b8b4] bg-[#fff4f2] text-[#a62b24]",
  hidden: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  expired: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  deleted: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  none: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  pending: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]",
  approved: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]",
  flagged: "border-[#f1b8b4] bg-[#fff4f2] text-[#a62b24]",
  active: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]",
  inactive: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  suspended: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]",
  new: "border-[#f3d38b] bg-[#fff8e8] text-[#8a5a00]",
  contacted: "border-[#c5d7ff] bg-[#eef4ff] text-[#2f5ea8]",
  qualified: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]",
  won: "border-[#9bd8bd] bg-[#ebfbf3] text-[#16794f]",
  lost: "border-[#d5dae2] bg-[#f7f7f8] text-[#5f6675]",
  spam: "border-[#f1b8b4] bg-[#fff4f2] text-[#a62b24]",
};

const statusLabel: Record<string, string> = {
  draft: "Bản nháp",
  submitted: "Đã gửi duyệt",
  pending_review: "Chờ duyệt",
  published: "Đã đăng",
  rejected: "Bị từ chối",
  hidden: "Đã ẩn",
  expired: "Hết hạn",
  deleted: "Đã xóa",
  none: "Chưa có",
  pending: "Đang chờ",
  approved: "Đã duyệt",
  flagged: "Bị gắn cờ",
  active: "Đang hoạt động",
  inactive: "Ngưng hoạt động",
  suspended: "Tạm khóa",
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  won: "Thành công",
  lost: "Thất bại",
  spam: "Spam",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-extrabold ${statusClassName[value] ?? statusClassName.draft}`}>
      {statusLabel[value] ?? value.replace(/_/g, " ")}
    </span>
  );
}
