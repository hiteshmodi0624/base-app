import { useEffect, useState } from 'react';
import { getVisibleFeatures } from '@/utils';
import usePrefs from '../../hooks/usePrefs';
import { BlobType, DitchRouteType, MarkerType } from '../../DitchStatics';
import React from 'react';
import DitchMarker from './DitchMarker';
import useBlobs from '@/hooks/useBlobs';
import useDitchMap from '@/hooks/useDitchMap';

const DitchMarkers = () => {
  const [markers, setMarkers] = useState<(DitchBlobInterface | WaypointInterface)[]>([]);
  const { getPref, prefs } = usePrefs();
  const { refreshMapCounter } = useDitchMap();
  const { blobs } = useBlobs();
  useEffect(() => {
    const visibleFeatures = getVisibleFeatures();
    if (!visibleFeatures) return;
    const showPlaceMarkers = getPref('ShowPlaceMarkers');
    setMarkers(
      visibleFeatures
        .filter(
          (feature) =>
            !('FeatureCollectionString' in feature) ||
            (!feature.isBreadcrumb && feature.DitchRoute.DitchBlob.DitchRouteTypeIndex !== DitchRouteType.imported),
        )
        .filter(
          (feature) =>
            showPlaceMarkers ||
            feature.TypeId === BlobType.waypoint ||
            ('DitchBlob' in feature && feature.DitchBlob.PlaceTypeIndex === MarkerType.home),
        ),
    );
  }, [blobs, prefs, refreshMapCounter]);
  return (
    <>
      {markers.map((feature, i) => (
        <DitchMarker feature={feature} key={`${feature.id} ${i}`} />
      ))}
    </>
  );
};
export default DitchMarkers;
