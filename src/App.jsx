/**
 * Main App Component
 */
import { useState } from "react";
import { GLOBAL_CSS } from "./styles/global.js";
import Sidebar from "./components/layouts/Sidebar.jsx";
import Topbar from "./components/layouts/Topbar.jsx";
import Placeholder from "./components/layouts/Placeholder.jsx";
import DashOverview from "./components/dashboards/DashOverview.jsx";
import DashMarketing from "./components/dashboards/DashMarketing.jsx";
import DashMarketingPaid from "./components/dashboards/DashMarketingPaid.jsx";
import DashSales from "./components/dashboards/DashSales.jsx";
import LeadsHub from "./components/dashboards/LeadsHub.jsx";
import DashProjects from "./components/dashboards/DashProjects.jsx";
import DashFinance from "./components/dashboards/DashFinance.jsx";
import WhatsAppHub from "./components/dashboards/WhatsAppHub.jsx";
import OrganicLeads from "./components/dashboards/OrganicLeads.jsx";
import FinanceDetails from "./components/dashboards/FinanceDetails.jsx";
import ClientProjects from "./components/dashboards/ClientProjects.jsx";
import LeadsReal from "./components/dashboards/LeadsReal.jsx";
import Login from "./components/auth/Login.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { COLORS } from "./constants/colors.js";

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
          color: COLORS.textMuted,
          fontSize: 14,
        }}
      >
        טוען...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <Login />
      </>
    );
  }

  const navigate = (id) => {
    setPage(id);
    setMobileOpen(false);
  };

  const renderPage = () => {
    if (page === "overview") return <DashOverview />;
    if (page === "marketing") return <DashMarketing />;
    if (page === "marketing-paid") return <DashMarketingPaid />;
    if (page === "sales") return <DashSales />;
    if (page === "sales-leads") return <LeadsHub />;
    if (page === "projects") return <DashProjects />;
    if (page === "finance") return <DashFinance />;
    if (page === "whatsapp") return <WhatsAppHub />;
    if (page === "marketing-organic") return <OrganicLeads />;
    if (page === "finance-details") return <FinanceDetails />;
    if (page === "client-projects") return <ClientProjects />;
    if (page === "leads-real") return <LeadsReal />;
    return <Placeholder page={page} />;
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        className="app-shell"
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: COLORS.bg,
        }}
      >
        <Sidebar
          page={page}
          setPage={navigate}
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />
        <div
          className={"sidebar-backdrop" + (mobileOpen ? " open" : "")}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className="main-col"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <Topbar page={page} onMenuClick={() => setMobileOpen(true)} />
          <div
            className="grid-bg page-scroll"
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}