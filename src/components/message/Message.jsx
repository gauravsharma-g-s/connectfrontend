import { useTheme } from "@mui/material";
import "./message.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
export default function Message({ message, own }) {
  const date = new Date(message.createdAt);
  const { palette } = useTheme();

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p
          className="messageText"
          style={{
            backgroundColor: own ? palette.primary.main : palette.neutral.main,
            color: palette.neutral.light,
          }}
        >
          {message.message}
        </p>
      </div>
      <div className="messageBottom">{timeAgo.format(date)}</div>
    </div>
  );
}
