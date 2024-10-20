import React from "react";
import { useEffect, useState } from "react";
import { getTester } from "../../DitchStore";
import CenteredMenu from "../ui/CenteredMenu";
import CenterDiv from "../ui/CenterDiv";
import DitchHeading from "../typography/DitchHeading";
import DitchText from "../typography/DitchText";
import DitchButton from "../ui/button/DitchButton";
import { usePathname } from "expo-router";
import { useAppSelector } from "@/hooks/useRedux";

const DitchTesterOverlay = () => {
  const [prompt, setPrompt] = useState<any>();
  const testStatus = useAppSelector((state) => state.test.value);
  const tester = getTester();
  const pathname = usePathname();

  useEffect(() => {
    tester.setCurrentLocation(pathname);
  }, [tester, pathname]);

  useEffect(() => {
    if (testStatus) {
      const handleTesterActions = () => {
        if (tester.prompt && !prompt) {
          setPrompt(tester.prompt);
        }
      };
      const interval = setInterval(handleTesterActions, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [prompt, tester.prompt, testStatus]);

  function AbortTestHandler() {
    tester.markPromptFail();
    setPrompt(undefined);
  }

  function OKHandler() {
    tester.markPromptSuccess();
    setPrompt(undefined);
  }
  
  return (
    <>
      {prompt && (
        <CenteredMenu style={{ margin: 'auto', padding: 20, paddingBottom: 0 }} hideCloseButton>
          <DitchHeading text={prompt.title} fontSizeIndex={3} />
          <DitchText text={prompt.body} fontSizeIndex={3} />
          <CenterDiv>
            <DitchButton actionLabel="Abort Tests" actionHandler={AbortTestHandler} style={{ margin: 20, marginBottom: 10 }} />
            <DitchButton actionLabel="OK" actionHandler={OKHandler} style={{ margin: 20, marginBottom: 10 }} />
          </CenterDiv>
        </CenteredMenu>
      )}
    </>
  );
};
export default DitchTesterOverlay;
