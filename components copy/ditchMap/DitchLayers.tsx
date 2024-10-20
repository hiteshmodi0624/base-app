import { BlobType, BoatPathType, DitchRouteType, emptyFeatureCollectionString } from '@/DitchStatics';
import useDitchMap from '@/hooks/useDitchMap';
import {
  getDitchLayers,
  getInfluencerLayerVisibility,
  refreshInfluencerLayers,
  getVisibleFeatures,
  getColorValue,
  lineWidthArray,
  getCurrentBreadCrumbs,
  getBreadCrumbFeatureCollection,
} from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import DitchLayer from './DitchLayer';
import ScatterLayer from './ScatterLayer';
import useUtils from '@/hooks/useUtils';
import usePrefs from '@/hooks/usePrefs';
import H3Layer from './H3Layer';

const InfluencerLayerState = {
  notStarted: 0,
  fetching: 1,
  fetched: 2,
};
export interface DitchLayerType {
  source: string;
  shape: FeatureCollection;
  layers: {
    id: string;
    type: 'symbol' | 'raster' | 'circle' | 'line' | 'background' | 'fill-extrusion' | 'fill' | 'heatmap' | 'hillshade' | 'sky';
    style: LineLayerStyleProps & FillLayerStyleProps;
  }[];
}
const DitchLayers = () => {
  const { refreshMapCounter } = useDitchMap();
  const [layers, setLayers] = useState<DitchLayerType[]>([]);
  const [influencerLayerState, setInfluencerLayerState] = useState(InfluencerLayerState.notStarted);
  const { getPref } = usePrefs();
  const smartPathStyle = useDitchLayerStyle(BoatPathType.smartPath);
  const noWakeStyle = useDitchLayerStyle(BoatPathType.noWakeZone);
  const interimPathStyle = useDitchLayerStyle(BoatPathType.interimPath);
  const influencerPathStyle = useDitchLayerStyle(BoatPathType.importedRoute);
  const importedPathStyle = useDitchLayerStyle(BoatPathType.gpxImport);
  const breadCrumbsPathStyle = useDitchLayerStyle(BoatPathType.breadCrumbs);
  const oldBreadCrumbsPathStyle = useDitchLayerStyle(BoatPathType.localKnowledge);
  useEffect(() => {
    const getInfluncerLayer = async () => {
      if (influencerLayerState === InfluencerLayerState.notStarted) {
        setInfluencerLayerState(InfluencerLayerState.fetching);
        await refreshInfluencerLayers();
        setInfluencerLayerState(InfluencerLayerState.fetched);
      }
    };
    getInfluncerLayer();
  }, [influencerLayerState]);
  useEffect(() => {
    const visibleFeatures = getVisibleFeatures();
    const smartPath = JSON.parse(emptyFeatureCollectionString);
    const noWakePath = JSON.parse(emptyFeatureCollectionString);
    const interimPath = JSON.parse(emptyFeatureCollectionString);
    const importedPath = JSON.parse(emptyFeatureCollectionString);
    const oldBreadCrumbsPath = JSON.parse(emptyFeatureCollectionString);
    let breadCrumbsPath = JSON.parse(emptyFeatureCollectionString);

    const influencerLayers = [];
    for (const feature of visibleFeatures) {
      if (feature.TypeId === BlobType.waypoint && 'features' in feature) {
        if (feature.hasLines) {
          if (feature.hasImportedRoute) {
            importedPath.features.push(...feature.featureCollection['features']);
          } else if (feature.isBreadcrumb) {
            oldBreadCrumbsPath.features.push(...feature.featureCollection['features']);
          } else {
            const smartRoute = feature.smartRoute;
            if (smartRoute.cruisingRoute) {
              smartPath.features.push(...JSON.parse(smartRoute.cruisingRoute).features);
            }
            if(smartRoute.noWakeRoute){
              noWakePath.features.push(...JSON.parse(smartRoute.noWakeRoute).features);

            }
          }
        } else if (
          feature.index !== feature.DitchRoute.waypoints.length - 1 &&
          feature.DitchRoute.DitchBlob.DitchRouteTypeIndex !== DitchRouteType.imported
        ) {
          interimPath.features.push(feature.interimPath);
        }
      }
    }
    if (getInfluencerLayerVisibility()) {
      const tapableLayers = getDitchLayers();
      for (const layer of tapableLayers.filter((e) => e.InfluencerLayer === true)) {
        const influencerLayer: DitchLayerType = {
          source: layer.Name,
          shape: JSON.parse(layer.FeatureCollectionString),
          layers: [
            {
              id: layer.Name,
              type: 'line',
              style: influencerPathStyle,
            },
          ],
        };
        influencerLayers.push(influencerLayer);
      }
    }
    const showBreadCrumbs = getPref('ShowBreadCrumbs');
    if(showBreadCrumbs) {
      const breadCrumbs = getCurrentBreadCrumbs();
      breadCrumbsPath = getBreadCrumbFeatureCollection(breadCrumbs);
    }
    setLayers([
      {
        source: 'oldBreadCrumbsPath',
        layers: [
          {
            id: 'oldBreadCrumbsPath',
            type: 'line',
            style: oldBreadCrumbsPathStyle,
          },
        ],
        shape: oldBreadCrumbsPath,
      },
      {
        source: 'breadCrumbsPath',
        layers: [
          {
            id: 'breadCrumbsPath',
            type: 'line',
            style: breadCrumbsPathStyle,
          },
        ],
        shape: breadCrumbsPath,
      },
      {
        source: 'interimPath',
        layers: [
          {
            id: 'interimPath',
            type: 'line',
            style: interimPathStyle,
          },
        ],
        shape: interimPath,
      },
      {
        source: 'importedPath',
        layers: [
          {
            id: 'importedPath',
            type: 'line',
            style: importedPathStyle,
          },
        ],
        shape: importedPath,
      },
      ...influencerLayers,
      {
        source: 'smartPath',
        shape: smartPath,
        layers: [
          {
            id: 'smartPath',
            type: 'line',
            style: smartPathStyle,
          },
        ],
      },
      {
        source: 'noWake',
        shape: noWakePath,
        layers: [
          {
            id: 'noWake',
            type: 'line',
            style: noWakeStyle,
          },
        ],
      },
    ]);
  }, [refreshMapCounter, influencerLayerState]);
  return (
    <>
      <ScatterLayer />
      {getPref('ShowH3Overlay') && <H3Layer />}
      {layers.map((layer, i) => (
        <DitchLayer layer={layer} key={`${layer.source + i}`} />
      ))}
    </>
  );
};
export default DitchLayers;

const useDitchLayerStyle = (boatPathType: number) => {
  const { tapMode } = useUtils();
  const { prefs, getPref } = usePrefs();

  return useMemo(() => {
    return {
      lineColor: getColorValue(boatPathType, tapMode),
      lineWidth: lineWidthArray(getPref('PathLineWidth')),
      lineDasharray:
        boatPathType === BoatPathType.smartPath || boatPathType === BoatPathType.gpxImport
          ? lineDashArray.straight
          : boatPathType === BoatPathType.noWakeZone
            ? lineDashArray.smallMidDash
            : lineDashArray.evenDashed,
    };
  }, [tapMode, prefs]);
};

const lineDashArray = {
  straight: undefined,
  evenDashed: [1.0, 1.0],
  smallMidDash: [2.0, 1.0],
  incDash: [1.0, 2.0],
};