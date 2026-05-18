import { ChatRoom } from "../../components/chat/ChatRoom";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCommodityProfile } from "../../context/CommodityProfileContext";

export function CommodityChatTab() {
  const commodity = useCommodityProfile();

  return (
    <ProfileTabPanel>
      <ChatRoom roomType="commodity" roomSlug={commodity.id} roomLabel={commodity.name} compact />
    </ProfileTabPanel>
  );
}
