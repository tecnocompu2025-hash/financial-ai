import Sidebar from "../dashboard/Sidebar";
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
    <div className="flex h-screen bg-slate-950 text-white">

      <Sidebar userName={displayName} onLogout={onLogout} />

      <div className="flex flex-col flex-1">

        <Header userName={displayName} />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
