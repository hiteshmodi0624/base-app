import React from 'react';
import { ScrollView } from 'react-native';
import ScatterFilter from './ScatterFilter';
import PageLayout from '../layout/PageLayout';
import BlankButton from '../ui/button/BlankButton';
import DitchModal from '../ui/DitchModal';

interface CustomizeMapProp {
  closeHandler: () => void;
}

function CustomizeMap({ closeHandler }: CustomizeMapProp) {
  return (
    <DitchModal
      onCloseHandler={closeHandler}
      style={{ padding: 0, bottom: 0, position: 'absolute', width: '100%', maxWidth: 600, borderRadius: 0, zIndex: 100 }}
    >
      <PageLayout
        style={{
          width: '100%',
          padding: 0,
        }}
        title="Layers"
        notScrollable
      >
        <ScrollView style={{ flex: 1, flexDirection: 'column', maxHeight: 250 }}>
          <BlankButton style={{ padding: 10, paddingHorizontal: 0 }} onClickHandler={() => {}}>
            <ScatterFilter />
          </BlankButton>
        </ScrollView>
      </PageLayout>
    </DitchModal>
  );
}

export default CustomizeMap;
