import Topnav from "../ui/home/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen md:overflow-hidden">
    <div className="w-full flex-none md:w-64">
      <Topnav />
    </div>
    <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
  </div>
  );
}
