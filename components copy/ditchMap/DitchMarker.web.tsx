import useMapbox from '../../hooks/useMapbox';
import React from 'react';
import { Marker } from 'react-map-gl';
import { getImageSource } from '@/utils';
import { View } from 'react-native';
import DitchImage from '../ui/DitchImage';
import useMarkerFeatures from '@/hooks/useMarkerFeatures';
import DitchText from '../typography/DitchText';
import usePrefs from '@/hooks/usePrefs';

const DitchWebMarkers = ({ feature }: { feature: WaypointInterface | DitchBlobInterface }) => {

  const { featureTapped, featureDragging } = useMapbox();
  const { markerSize, markerCurrentIcon, handleDragEnd, handleDragStart, annotationId } = useMarkerFeatures(feature);
  const { prefs } = usePrefs();
  return (
    <Marker
      key={`${annotationId} ${markerCurrentIcon}`}
      latitude={+feature.Latitude}
      longitude={+feature.Longitude}
      draggable={true}
      onDrag={(e) => featureDragging([e.lngLat.lng, e.lngLat.lat])}
      onDragStart={handleDragStart}
      onDragEnd={() => handleDragEnd(feature)}
      onClick={(e) => featureTapped({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }, feature)}
    >
      <View style={{ alignItems: 'center' }}>
        <DitchImage image={getImageSource(markerCurrentIcon)} size={markerSize} />
        {prefs.ShowMarkerLabels && 'FriendlyName' in feature && feature.FriendlyName && markerSize >= 25 && (
          <DitchText
            text={feature.FriendlyName}
            fontSizeIndex={0}
            key={`${feature.FriendlyName} ${prefs.ShowMarkerLabels}`}
          />
        )}
      </View>
    </Marker>
  );
};

export default DitchWebMarkers;
