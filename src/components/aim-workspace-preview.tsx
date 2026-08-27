import {
  ArrowUp,
  ChevronDown,
  FileText,
  Folder,
  Grid2x2,
  Home,
  Plus,
  Settings,
} from "lucide-react";

export function AimWorkspacePreview() {
  return (
    <div className="aim-preview" aria-hidden="true">
      <div className="aim-preview__laptop">
        <div className="aim-preview__bezel">
          <div className="aim-preview__camera" />
          <div className="aim-preview__screen">
            <aside className="aim-preview__rail">
              <span className="aim-preview__mark">
                <img src="/os-assets/logo-white.png" alt="" />
              </span>
              <span className="aim-preview__icon aim-preview__icon--blue">
                <Home strokeWidth={2} />
              </span>
              <span className="aim-preview__icon aim-preview__icon--green">
                <Folder strokeWidth={2} />
              </span>
              <span className="aim-preview__icon aim-preview__icon--purple">
                <FileText strokeWidth={2} />
              </span>
              <span className="aim-preview__icon aim-preview__icon--yellow">
                <Grid2x2 strokeWidth={2} />
              </span>
              <span className="aim-preview__icon aim-preview__icon--muted aim-preview__icon--foot">
                <Settings strokeWidth={2} />
              </span>
            </aside>

            <div className="aim-preview__stage">
              <div className="aim-preview__newchat">
                <Plus strokeWidth={2.4} />
                New chat
              </div>

              <div className="aim-preview__hero">
                <div className="aim-preview__brand">
                  <img src="/os-assets/logo-white.png" alt="" />
                  <span>AIM</span>
                </div>
                <p className="aim-preview__hello">Welcome back</p>
                <p className="aim-preview__sub">
                  Your Spectr workspace overview. Ask AIM anything to get started.
                </p>
              </div>

              <div className="aim-preview__composer">
                <p>Plan, search, build anything</p>
                <div className="aim-preview__composer-bar">
                  <span className="aim-preview__model">
                    <Plus strokeWidth={2.4} />
                    Claude Haiku 4.5
                    <ChevronDown strokeWidth={2} />
                  </span>
                  <span className="aim-preview__send">
                    <ArrowUp strokeWidth={2.4} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="aim-preview__hinge" />
        <div className="aim-preview__base" />
      </div>
    </div>
  );
}
