import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

export default function AdvertWidget() {
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
        <FlexBetween>
            <Typography color={dark}  variant="h5" fontWeight="500">
                Sponsored
            </Typography>
            <Typography color={medium}>Create Ad</Typography>
        </FlexBetween>
        <img
           width="100%"
           height="auto"
           alt="advert"
           src="../assets/info4.jpeg"
           style={{borderRadius: "0.75rem",margin: "0.75rem 0"}}
           />
           <FlexBetween>
            <Typography color={main}>Sugar Cosmetics</Typography>
            <Typography color={medium}>sugarcosmetics.com</Typography>
           </FlexBetween>
           <Typography color={medium} m="0.5rem 0">
            Your pathway is stunning and immacualte beauty and made sure your skin is exfoliating skin and shining like light.
           </Typography>
    </WidgetWrapper>
  )
}

