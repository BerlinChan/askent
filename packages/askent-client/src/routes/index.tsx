import React from "react";
import RequireAuth from "../components/RequireAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../components/Loading";
import { MainProvider } from "../components/Providers";

const HomeComponent = React.lazy(() => import("./home"));
const LoginComponent = React.lazy(() => import("./login"));
const SignupComponent = React.lazy(() => import("./signup"));
const AdminComponent = React.lazy(() => import("./admin"));
const EventComponent = React.lazy(() => import("./event"));
const AboutComponent = React.lazy(() => import("./about"));
const DemoComponent = React.lazy(() => import("./demo"));
const Error401Component = React.lazy(() => import("./error/401"));
const Error404Component = React.lazy(() => import("./error/404"));

const Router = () => {
  return (
    <MainProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <React.Suspense fallback={<Loading />}>
              <HomeComponent />
            </React.Suspense>
          } />
          <Route path="/login" element={
            <React.Suspense fallback={<Loading />}>
              <LoginComponent />
            </React.Suspense>
          } />
          <Route path="/signup" element={
            <React.Suspense fallback={<Loading />}>
              <SignupComponent />
            </React.Suspense>
          } />

          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                <React.Suspense fallback={<Loading />}>
                  <AdminComponent />
                </React.Suspense>
              </RequireAuth>
            }
          />

          <Route path="/event/:id/*" element={
            <React.Suspense fallback={<Loading />}>
              <EventComponent />
            </React.Suspense>
          } />

          <Route path="/about" element={
            <React.Suspense fallback={<Loading />}>
              <AboutComponent />
            </React.Suspense>
          } />
          <Route path="/demo" element={
            <React.Suspense fallback={<Loading />}>
              <DemoComponent />
            </React.Suspense>
          } />

          <Route path="/unauthorized" element={
            <React.Suspense fallback={<Loading />}>
              <Error401Component />
            </React.Suspense>
          } />
          <Route path="*" element={
            <React.Suspense fallback={<Loading />}>
              <Error404Component />
            </React.Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </MainProvider>
  );
};

export default Router;
