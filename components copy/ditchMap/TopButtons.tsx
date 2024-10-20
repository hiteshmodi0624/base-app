import React, { useState } from "react";
import { Platform, StyleSheet, View } from 'react-native';
import { ditchColors, TapMode } from "../../DitchStatics";
import usePrefs from "@/hooks/usePrefs";
import useH3 from "@/hooks/useH3";
import { getResolution, setSelectH3sState } from "@/utils";
import DitchIcon from "../ui/DitchIcon";
import DitchHeading from "../typography/DitchHeading";
import CenterDiv from "../ui/CenterDiv";
import BlankButton from "../ui/button/BlankButton";
import { recenter, setZoom } from "@/hooks/useMapboxLibraries";
import useDitchMap from "@/hooks/useDitchMap";
import CustomizeMap from "../layerFilter/CustomizeMap";
import useUtils from "@/hooks/useUtils";
import DitchText from "../typography/DitchText";

const TopButtons = () => {
  const { resetSelectedH3s } = useH3();
  const { performUndo, undoStack, tapMode } = useUtils();
  const { lastZoom, heading, followingUser, setNorthUp, setFollowingUser, northUp } = useDitchMap();
  const [layersVisible, setLayersVisible] = useState(false);
  const { getPref } = usePrefs();
  const toggleLayers = () => {
    setLayersVisible((prev) => !prev);
  };

  const [selectH3, setSelectH3] = useState(false);
  const selectH3ToggleHandler = () => {
    resetSelectedH3s();
    setSelectH3((prev) => {
      setSelectH3sState(!prev);
      return !prev;
    });
  };
  const reLocate = () => {
    recenter();
    setFollowingUser(true);
  };
  return (
    <>
      <BlankButton style={[styles.container, styles.rightContainer]}>
        <DitchIcon name="add" onClick={() => setZoom({ zoomIn: true })} style={[styles.button]} />
        <DitchIcon name="remove" onClick={() => setZoom({ zoomIn: false })} style={[styles.button]} />
        <DitchIcon name="layers" onClick={toggleLayers} style={[styles.button]} />
        {getPref('ShowH3Overlay') && (
          <BlankButton style={{ position: 'relative' }} onClickHandler={selectH3ToggleHandler}>
            {selectH3 ? (
              <DitchIcon name={'hexagon'} style={styles.button} />
            ) : (
              <DitchIcon name="hexagon" style={[styles.button, { opacity: 0.6 }]} />
            )}
            <CenterDiv style={{ position: 'absolute', top: 16 }}>
              <DitchHeading
                text={getResolution(lastZoom)}
                fontSizeIndex={1}
                styles={{ position: 'absolute', color: selectH3 ? 'white' : ditchColors.buttonRed }}
              />
            </CenterDiv>
          </BlankButton>
        )}
        {!followingUser && (
          <View style={{ alignItems: 'center' }}>
            <DitchIcon name="location-searching" onClick={reLocate} style={[styles.button, { marginBottom: -2 }]} />
            <DitchText
              text={'Recenter'}
              fontSizeIndex={0}
              textStyles={{ padding: 0, color: ditchColors.buttonRed }}
              fontFamily="Arial"
              fontWeightIndex={2}
            />
          </View>
        )}
        {followingUser && Platform.OS !== 'web' && (
          <View style={{ alignItems: 'center' }}>
            <DitchIcon
              name="arrow-circle-up"
              onClick={() => setNorthUp(heading !== 0)}
              style={[styles.button, { transform: [{ rotate: `${Math.floor(heading ?? 0)}deg` }], marginBottom: -2 }]}
            />
            <DitchText
              text={northUp ? 'North' : 'Heading'}
              fontSizeIndex={0}
              textStyles={{ padding: 0, color: ditchColors.buttonRed }}
              fontFamily="Arial"
              fontWeightIndex={2}
            />
          </View>
        )}
        {undoStack.length > 0 && tapMode !== TapMode.fetchingPaths && (
          <View style={{ alignItems: 'center' }}>
            <DitchIcon name={'undo'} onClick={performUndo} style={[styles.button, { marginBottom: -10 }]} />
            <DitchText
              text="Undo"
              fontSizeIndex={0}
              textStyles={{ padding: 0, color: ditchColors.buttonRed }}
              fontFamily="Arial"
              fontWeightIndex={2}
            />
          </View>
        )}
      </BlankButton>
      {layersVisible && <CustomizeMap closeHandler={toggleLayers} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    width: 55,
  },
  button: {
    marginVertical: 8,
    color: ditchColors.buttonRed,
    fontSize: 40,
    borderBlockColor: ditchColors.buttonRed,
  },
  rightContainer: {
    right: 4,
    top: 10,
  },
});

export default TopButtons;
