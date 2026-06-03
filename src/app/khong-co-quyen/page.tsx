export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] px-6 py-10 text-[#1f2430]">
      <section className="mx-auto max-w-xl">
        <p className="text-sm font-bold uppercase tracking-normal text-[#c7352d]">403</p>
        <h1 className="mt-2 text-2xl font-extrabold">Không có quyền truy cập</h1>
        <p className="mt-3 text-sm leading-6 text-[#5f6675]">
          Tài khoản hiện tại không có vai trò phù hợp để truy cập khu vực này.
        </p>
      </section>
    </main>
  );
}
