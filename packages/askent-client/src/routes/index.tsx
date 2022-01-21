import React from "react";
import loadable from "@loadable/component";
import RequireAuth from "../components/RequireAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../components/Loading";
import { MainProvider } from "../components/Providers";

const HomeComponent = loadable(() => import("./home"), {
  fallback: <Loading />,
});
const LoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />,
});
const SignupComponent = loadable(() => import("./signup"), {
  fallback: <Loading />,
});
const AdminComponent = loadable(() => import("./admin"), {
  fallback: <Loading />,
});
const EventComponent = loadable(() => import("./event"), {
  fallback: <Loading />,
});
const AboutComponent = loadable(() => import("./about"), {
  fallback: <Loading />,
});
const DemoComponent = loadable(() => import("./demo"), {
  fallback: <Loading />,
});
const Error401Component = loadable(() => import("./error/401"), {
  fallback: <Loading />,
});
const Error404Component = loadable(() => import("./error/404"), {
  fallback: <Loading />,
});

const Router = () => {
  return (
    <MainProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignupComponent />} />

          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                <AdminComponent />
              </RequireAuth>
            }
          />

          <Route path="/event/:id/*" element={<EventComponent />} />

          <Route path="/about" element={<AboutComponent />} />
          <Route path="/demo" element={<DemoComponent />} />

          <Route path="/unauthorized" element={<Error401Component />} />
          <Route path="*" element={<Error404Component />} />
        </Routes>
      </BrowserRouter>
    </MainProvider>
  );
};

export default Router;
