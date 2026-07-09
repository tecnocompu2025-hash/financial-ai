import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}