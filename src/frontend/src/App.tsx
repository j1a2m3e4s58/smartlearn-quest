import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import SubjectPage from "@/pages/SubjectPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy } from "react";

const WorldMapPage = lazy(() => import("@/pages/WorldMapPage"));
const BasicLevelSelectPage = lazy(() => import("@/pages/BasicLevelSelectPage"));
const WorldSubjectsPage = lazy(() => import("@/pages/WorldSubjectsPage"));
const CategoryGridPage = lazy(() => import("@/pages/CategoryGridPage"));
const SubGameGridPage = lazy(() => import("@/pages/SubGameGridPage"));

const HubPage = lazy(() => import("@/pages/HubPage"));
const GamePage = lazy(() => import("@/pages/GamePage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const TeacherDashboardPage = lazy(() => import("@/pages/TeacherDashboardPage"));
const ParentDashboardPage = lazy(() => import("@/pages/ParentDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p
              className="text-xs font-bold tracking-widest uppercase text-muted-foreground"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Loading
            </p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <AnimatePresence mode="wait">
      <Outlet />
    </AnimatePresence>
  ),
});

// Index route – redirect based on auth state
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/world-map" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <PageWrapper>
      <LoginPage />
    </PageWrapper>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => (
    <PageWrapper>
      <OnboardingPage />
    </PageWrapper>
  ),
});

const worldMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world-map",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <WorldMapPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subject/$subjectId",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <SubjectPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const hubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hub/$hubId",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <HubPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$gameId",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <GamePage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$gameId",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <ResultsPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <DashboardPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const teacherDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/teacher",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <TeacherDashboardPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const parentDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/parent",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <ParentDashboardPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const adminDashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <AdminDashboardPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const worldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <BasicLevelSelectPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const worldLevelSubjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world/$levelId/subjects",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <WorldSubjectsPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const worldLevelSubjectCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world/$levelId/subject/$subjectId/categories",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <CategoryGridPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const worldLevelSubjectCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/world/$levelId/subject/$subjectId/category/$categoryId",
  component: () => (
    <SuspenseWrapper>
      <PageWrapper>
        <SubGameGridPage />
      </PageWrapper>
    </SuspenseWrapper>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  onboardingRoute,
  worldMapRoute,
  subjectRoute,
  hubRoute,
  gameRoute,
  resultsRoute,
  dashboardRoute,
  teacherDashRoute,
  parentDashRoute,
  adminDashRoute,
  worldRoute,
  worldLevelSubjectsRoute,
  worldLevelSubjectCategoriesRoute,
  worldLevelSubjectCategoryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
