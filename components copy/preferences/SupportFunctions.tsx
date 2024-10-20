import React from 'react';
import { ditchColors } from '../../DitchStatics';
import { sendEmail } from '@/utils';
import ButtonTile from '../settingsTile/ButtonTile';
import DitchIcon from '../ui/DitchIcon';

const EmailUs = () => {
  return (
    <ButtonTile
      title={'Email us at \nsupport@ditchnavigation.com'}
      icon={<DitchIcon name="mail" color={ditchColors.buttonGreen} />}
      action={sendEmail.bind(null, 'support@ditchnavigation.com')}
    />
  );
};
const SupportFunctions = [EmailUs];
export default SupportFunctions;
