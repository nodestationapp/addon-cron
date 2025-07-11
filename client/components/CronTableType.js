import Typography from "@mui/material/Typography";
import { IconifyIcon } from "@nstation/design-system";

const CronTableType = ({ data }) => {
  const label =
    data?.label ??
    (data?.message !== null && typeof data?.message !== "object"
      ? data.message
      : "-");

  return (
    <Typography
      variant="body2"
      sx={{ height: "100%", display: "flex", alignItems: "center", gap: 1 }}
    >
      <IconifyIcon icon="lucide:timer" style={{ flexShrink: 0 }} />
      {label}
    </Typography>
  );
};

export default CronTableType;
