import { SettingsForm } from "@nstation/design-system";
import { BaseLayout } from "@nstation/design-system/Layouts";

import EmailProviders from "../components/EmailProviders.js";
import EmailProvider from "../contexts/emails.js";

const EmailSettingsContent = () => {
  const settings_data = [
    {
      label: "Provider",
      component: <EmailProviders />,
    },
  ];

  const tabs = [
    {
      title: "Entries",
      href: "/emails",
    },
  ];

  return (
    <BaseLayout
      title="Settings"
      subtitle="Manage your email settings"
      tabs={tabs}
    >
      <SettingsForm data={settings_data} />
    </BaseLayout>
  );
};

const EmailSettings = () => {
  return (
    <EmailProvider>
      <EmailSettingsContent />
    </EmailProvider>
  );
};

export default EmailSettings;
