import { View } from "react-native";
import CenteredMenu from "../ui/CenteredMenu";
import React from "react";
import DitchD from "../svg/DitchD";
import DitchText from "../typography/DitchText";
import { versionString } from "@/utils";
import DitchButton from "../ui/button/DitchButton";
import { CognitoEnvironmentLabels, ditchUrls } from "@/DitchStatics";
import useCognito from "@/hooks/useCognito";

const AboutDitch = ({ onCloseHandler }: { onCloseHandler: () => void }) => {
    const { cognitoLabel } = useCognito();
  return (
    <>
      <CenteredMenu onCloseHandler={onCloseHandler} style={{ margin: 'auto', paddingHorizontal: 50, paddingVertical: 30 }}>
        <View style={{ margin: 'auto' }}>
          <DitchD size={100} />
        </View>
        <DitchText
          text={`Version: ${versionString()}`}
          fontSizeIndex={2}
          styles={{ margin: 5, marginTop: 10 }}
          textStyles={{ textAlign: 'center' }}
        />
        <DitchText
          text={CognitoEnvironmentLabels[cognitoLabel]}
          fontSizeIndex={2}
          styles={{ margin: 5, marginTop: 10 }}
          textStyles={{ textAlign: 'center' }}
        />
        <DitchButton
          actionLabel={'Terms of Use'}
          actionUrl={ditchUrls.terms}
          key="terms"
          variant={1}
          backgroundColor="transparent"
          size={0}
          style={{ paddingVertical: 5 }}
        />
        <DitchButton
          actionLabel={'Privacy Policy'}
          actionUrl={ditchUrls.privacy}
          key="privacy"
          variant={1}
          backgroundColor="transparent"
          size={0}
          style={{ paddingVertical: 0 }}
        />
      </CenteredMenu>
    </>
  );
};
export default AboutDitch;