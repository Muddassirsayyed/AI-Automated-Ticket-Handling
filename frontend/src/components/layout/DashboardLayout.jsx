import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ChatBot from '../common/ChatBot';

const DashboardLayout = ({ children, title }) => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />
    <div className="flex-1 ml-64 flex flex-col">
      <Topbar title={title} />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
    <ChatBot />
  </div>
);

export default DashboardLayout;
