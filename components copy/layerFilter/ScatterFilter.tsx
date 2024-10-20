import React from 'react';
import { View } from 'react-native';
import ToggleTile from '../settingsTile/ToggleTile';
import usePrefs from '../../hooks/usePrefs';
import useLayerFilters from '../../hooks/useLayerFilters';
import { getBathymetryLayerId, getCorpsVisibility, getInfluencerLayer, getInfluencerLayerVisibility, setCorpsVisibility } from '@/utils';
import SelectTile from '../settingsTile/SelectTile';
import BoatLengthsSlider from './BoatLengthsSlider';
import useDitchMap from '@/hooks/useDitchMap';

const ScatterFilter = () => {
  const { getPref } = usePrefs();
  const { setLayerVisibility, setSateliteView, setInfluencerLayerVisibility } = useLayerFilters();
  const { satellite } = useDitchMap();
  const influencerLayer = getInfluencerLayer();
  return (
    <View style={{ width: '100%' }}>
      <SelectTile title="AIS Vessel Information" overlayContent={<BoatLengthsSlider />} hideHeading/>
      <ToggleTile
        initialValue={getCorpsVisibility()}
        title="Corps Of Engineers"
        toggleFunction={(value: boolean) => {
          const layerId = getBathymetryLayerId();
          if (layerId) {
            setLayerVisibility(layerId, value);
            setCorpsVisibility(value);
          }
        }}
        disabled={satellite}
      />
      {influencerLayer && (
        <ToggleTile
          initialValue={getInfluencerLayerVisibility()}
          title={influencerLayer.Name}
          toggleFunction={(value: boolean) => {
            setInfluencerLayerVisibility(value);
          }}
        />
      )}
      <ToggleTile
        initialValue={getPref('DitchMapStyleIndex') === 1}
        title="Satellite View"
        toggleFunction={(value: boolean) => {
          setSateliteView(value);
        }}
        // subtitle={'Satellite View temporarily hides layers that can \nonly be viewed on the Nav Chart.'}
        showSubtitle
      />
    </View>
  );
};

export default ScatterFilter;
