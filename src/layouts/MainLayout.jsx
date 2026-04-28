import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { prefetchAppRouteChunks } from "../lazyPages";
import "./MainLayout.css";

export default function MainLayout() {
  useEffect(() => {
    prefetchAppRouteChunks();
  }, []);

  return (
    <div className="main-app-shell">
      <div className="main-app-shell__frame">
        <main className="main-app-shell__main">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
