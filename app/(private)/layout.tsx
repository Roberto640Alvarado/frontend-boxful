import Navbar from "@/components/Navbar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      {/* md:ml-64 para desktop, pt-14 para mobile (top bar height) */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}