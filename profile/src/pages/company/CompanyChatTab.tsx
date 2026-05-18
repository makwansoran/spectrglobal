import { ChatRoom } from "../../components/chat/ChatRoom";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyChatTab() {
  const { company } = useCompanyProfile();

  return (
    <ProfileTabPanel>
      <ChatRoom roomType="company" roomSlug={company.id} roomLabel={company.name} compact />
    </ProfileTabPanel>
  );
}
