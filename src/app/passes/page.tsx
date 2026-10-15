import { WorkInProgressView } from "@/components/WorkInProgressView";

export const metadata = {
  title: "My Passes",
  description: "Digital event passes and QR check-in hub for NEXUSFEST 2026.",
};

export default function PassesPage() {
  return <WorkInProgressView variant="passes" backgroundImageUrl="/stage-wip-bg.jpg" />;
}
