import { WorkInProgressView } from "@/components/WorkInProgressView";

export const metadata = {
  title: "Schedule",
  description: "Three-day festival timetable for NEXUSFEST 2026.",
};

export default function SchedulePage() {
  return <WorkInProgressView variant="schedule" backgroundImageUrl="/stage-wip-bg.jpg" />;
}
