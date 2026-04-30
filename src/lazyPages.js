import { lazy } from "react";

/** Route-level code splitting — chunks warm up via `prefetchAppRouteChunks` after shell mounts. */
export const ClassmatesPage = lazy(() => import("./components/ClassmatesPage"));
export const BatchStudentsPage = lazy(() => import("./components/BatchStudentsPage"));
export const Batch2013StudentsPage = lazy(() => import("./components/Batch2013StudentsPage"));
export const Batch2015StudentsPage = lazy(() => import("./components/Batch2015StudentsPage"));
export const Batch2016StudentsPage = lazy(() => import("./components/Batch2016StudentsPage"));
export const Batch2014StudentProfile = lazy(() => import("./components/Batch2014StudentProfile"));
export const Batch2013StudentProfile = lazy(() => import("./components/Batch2013StudentProfile"));
export const Batch2015StudentProfile = lazy(() => import("./components/Batch2015StudentProfile"));
export const Batch2016StudentProfile = lazy(() => import("./components/Batch2016StudentProfile"));
export const TeachersPage = lazy(() => import("./components/TeachersPage"));
export const GalleryPage = lazy(() => import("./components/GalleryPage"));
export const Alumni = lazy(() => import("./components/Alumni"));
export const AlumniProfile = lazy(() => import("./components/AlumniProfile"));
export const HostelLayout = lazy(() => import("./components/hostel/HostelLayout"));
export const HostelDashboard = lazy(() => import("./components/hostel/HostelDashboard"));
export const RoomList = lazy(() => import("./components/hostel/RoomList"));
export const RoomDetails = lazy(() => import("./components/hostel/RoomDetails"));
export const VotingPage = lazy(() => import("./components/VotingPage"));
export const BellRingMadness = lazy(() => import("./components/BellRingMadness"));
export const FeedbackPage = lazy(() => import("./components/FeedbackPage"));
export const StudentProfilePage = lazy(() => import("./components/StudentProfilePage"));
export const MobilePeopleMenu = lazy(() => import("./pages/MobilePeopleMenu"));
export const MobileBatchesMenu = lazy(() => import("./pages/MobileBatchesMenu"));
export const MobileFeaturesMenu = lazy(() => import("./pages/MobileFeaturesMenu"));
export const MeetStudentsGalleryPage = lazy(() => import("./pages/MeetStudentsGalleryPage"));

const CHUNK_IMPORTS = [
  () => import("./components/ClassmatesPage"),
  () => import("./components/BatchStudentsPage"),
  () => import("./components/Batch2013StudentsPage"),
  () => import("./components/Batch2015StudentsPage"),
  () => import("./components/Batch2016StudentsPage"),
  () => import("./components/Batch2014StudentProfile"),
  () => import("./components/Batch2013StudentProfile"),
  () => import("./components/Batch2015StudentProfile"),
  () => import("./components/Batch2016StudentProfile"),
  () => import("./components/TeachersPage"),
  () => import("./components/GalleryPage"),
  () => import("./components/Alumni"),
  () => import("./components/AlumniProfile"),
  () => import("./components/hostel/HostelLayout"),
  () => import("./components/hostel/HostelDashboard"),
  () => import("./components/hostel/RoomList"),
  () => import("./components/hostel/RoomDetails"),
  () => import("./components/VotingPage"),
  () => import("./components/BellRingMadness"),
  () => import("./components/FeedbackPage"),
  () => import("./components/StudentProfilePage"),
  () => import("./pages/MobilePeopleMenu"),
  () => import("./pages/MobileBatchesMenu"),
  () => import("./pages/MobileFeaturesMenu"),
  () => import("./pages/MeetStudentsGalleryPage"),
];

export function prefetchAppRouteChunks() {
  const run = () => {
    for (const load of CHUNK_IMPORTS) {
      void load();
    }
  };
  if (typeof window === "undefined") return;
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    ric(() => run(), { timeout: 3200 });
  } else {
    window.setTimeout(run, 900);
  }
}
