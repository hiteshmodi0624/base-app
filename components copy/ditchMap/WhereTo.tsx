import { ditchColors } from "../../DitchStatics";
import React, { useState } from "react";
import CenteredMenu from "../ui/CenteredMenu";
import { getUserLocation, hexToRgbA, log, searchForPlace } from '../../utils';
import useFeatures from "../../hooks/useFeatures";
import useUtils from "../../hooks/useUtils";
import DitchHeading from "../typography/DitchHeading";
import DitchText from "../typography/DitchText";
import WhereToList from "./WhereToList";
import { View } from "react-native";
import DitchTextInput from "../ui/DitchTextInput";
import { setCameraPosition } from "@/hooks/useMapboxLibraries";

interface WhereToProps {
  closeHandler: () => void;
}
interface SingleLocation {
  location?: DitchBlobInterface | undefined;
  name: string;
}
const SearchType = {
  from: 0,
  to: 1,
};

const defaultFoundLocation: {
  locations: DitchBlobInterface[];
  searchType: number;
} = { locations: [], searchType: SearchType.to };

function WhereTo({ closeHandler }: WhereToProps) {
  const currentLocation = getUserLocation();
  log(currentLocation);
  const [fromLocation, setFromLocation] = useState<SingleLocation>({
    name: '',
    location: undefined,
  });
  const [toLocation, setToLocation] = useState<SingleLocation>({
    name: '',
    location: undefined,
  });
  const [emptyMessage, setEmptyMessage] = useState('');
  const [foundLocations, setFoundLocations] = useState(defaultFoundLocation);
  const { createNewRoute } = useFeatures();
  const { navigateTo } = useUtils();
  const submitSearch = async (input: string, searchType: number) => {
    const places = await searchForPlace(input, currentLocation);
    if (places.length === 0 && input !== '') {
      setEmptyMessage(`No results found for ${input}`);
    } else {
      setEmptyMessage('');
    }
    setFoundLocations({ locations: places, searchType });
  };
  const onPlaceClickHandler = async (index: number, searchType: number) => {
    const newLocation = foundLocations.locations[index];
    let startLocation = fromLocation.location;
    let endLocation = toLocation.location;
    if (searchType === SearchType.from) {
      setFromLocation({
        name: newLocation.FriendlyName,
        location: newLocation,
      });
      startLocation = newLocation;
    } else {
      setToLocation({ name: newLocation.FriendlyName, location: newLocation });
      endLocation = newLocation;
    }
    setFoundLocations(defaultFoundLocation);
    let startPoint, endPoint;
    if (fromLocation.name === '' && searchType !== SearchType.from) {
      startPoint = currentLocation;
      log(startPoint);
    } else if (startLocation) {
      startPoint = {
        lat: startLocation.DitchBlob.Latitude,
        lng: startLocation.DitchBlob.Longitude,
      };
    }
    if (endLocation) {
      endPoint = {
        lat: endLocation.DitchBlob.Latitude,
        lng: endLocation.DitchBlob.Longitude,
      };
    }
    if (startPoint && endLocation && endPoint) {
      closeHandler();
      setCameraPosition({ latitude: startPoint.lat, longitude: startPoint.lng, zoom: 11 });
      navigateTo('index');
      await createNewRoute([startPoint, endPoint], false, 3704);
    }
  };
  return (
    <CenteredMenu
      style={{
        opacity: 0.9,
        backgroundColor: hexToRgbA(ditchColors.lightBlue, 0.9),
        margin: 'auto',
        padding: 20,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '70%',
        maxWidth: '95%',
        alignItems: 'center',
      }}
      onCloseHandler={closeHandler}
    >
      <DitchHeading text={'Where to, Captain?'} fontWeightIndex={2} fontSizeIndex={2} styles={{ marginRight: 20 }} />
      <View
        style={{
          flexDirection: 'column',
          display: 'flex',
          flex: 1,
        }}
      >
        <DitchTextInput
          icon={fromLocation.location !== undefined || currentLocation ? 'location-pin' : undefined}
          setInput={(value) =>
            setFromLocation(() => {
              submitSearch(value, SearchType.from);
              return { name: value };
            })
          }
          value={fromLocation.name}
          placeholder={currentLocation ? 'Current Location' : ''}
          label="FROM"
          style={{
            marginTop: 20,
          }}
          withSearchIcon
          autoFocus={currentLocation === undefined}
        />
        {(foundLocations.searchType === SearchType.to || foundLocations.locations.length === 0 || fromLocation.location !== undefined) && (
          <DitchTextInput
            icon={toLocation.location !== undefined ? 'location-pin' : undefined}
            setInput={(value) =>
              setToLocation(() => {
                submitSearch(value, SearchType.to);
                return { name: value };
              })
            }
            value={toLocation.name}
            label="TO"
            withSearchIcon
            autoFocus={currentLocation !== undefined}
          />
        )}
        <WhereToList foundLocations={foundLocations} onPlaceClickHandler={onPlaceClickHandler} emptyMessage={emptyMessage} />
        <DitchText
          text={'Use search fields above, or exit this window to set waypoints directly on the map.'}
          styles={{ margin: 0.5 }}
          fontWeightIndex={2}
          fontSizeIndex={2}
        />
      </View>
    </CenteredMenu>
  );
}

export default WhereTo;
