import useDitchMap from '@/hooks/useDitchMap';
import useLayerFilters from '@/hooks/useLayerFilters';
import React from 'react';
import { CircleLayer } from 'rnmapbox-ditch';

const ScatterLayer = () => {
  const { scatterFilter } = useLayerFilters();
  const { satellite } = useDitchMap();
  
  return <>{satellite === false && <CircleLayer id={scatterFilter.id} filter={scatterFilter.filter} existing={true} />}</>;
};

export default ScatterLayer;