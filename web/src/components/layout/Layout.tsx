import SidebarV2 from "../dashboard/SidebarV2";
import Header from "../dashboard/Header";
import { formatName } from "../../utils/formatName";

type Props = {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
};

export default function Layout({ children, userName, onLogout }: Props) {
  const displayName = formatName(userName);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      {/* Sidebar is fixed on the left */}
      <SidebarV2 userName={displayName} onLogout={onLogout} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header stays on top */}
        <Header userName={displayName} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
