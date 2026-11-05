import "./public.css";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#fdf8f6] text-[#1f1e1d]">{children}</div>;
}
