import React from 'react';
import DitchView from '../ui/DitchView';
import DitchHeading from '../typography/DitchHeading';
import useSubscription, { SubscriptionStatus } from '@/hooks/useSubscription';
import DitchText from '../typography/DitchText';
import { getImageSource, getPriceString } from '@/utils';
import DitchImage from '../ui/DitchImage';
import DitchButton from '../ui/button/DitchButton';
import useUtils from '@/hooks/useUtils';

const SubscriptionEndOverlay = () => {
  const { subscriptionStatus, changeSubscriptionOverlayVisibility } = useSubscription();
  const { navigateTo } = useUtils();
  const benefits = [
    {
      image: getImageSource('trial1'),
      heading: 'Smart Path',
      text: 'Unlimited access to data-driven routes, distilled from years of local knowledge.',
    },
    {
      image: getImageSource('trial2'),
      heading: 'Historical AIS data',
      text: 'Gain a new perspective on your route by seeing where other captains have been.',
    },
    {
      image: getImageSource('trial3'),
      heading: 'Customizable Chart',
      text: 'Personalize the data with filters like local captains, recency, and boat length.',
    },
  ];
  return (
    <DitchView style={{ width: 300 }}>
      <DitchHeading
        text={`Your ${subscriptionStatus === SubscriptionStatus.purchaseExpired ? 'Annual Subscription' : 'Free Trial'} Has Expired`}
        styles={{ marginVertical: 5, marginRight: 10 }}
        fontSizeIndex={2}
      />
      <DitchText
        text={`Get Ditch Premium for just ${getPriceString()}/year to continue access to:`}
        fontSizeIndex={2}
        styles={{ marginVertical: 5 }}
      />
      <DitchView style={{ rowGap: 20, margin: 'auto', paddingVertical: 10 }}>
        {benefits.map((benefit) => (
          <DitchView style={{ flexDirection: 'row', columnGap: 20 }} key={benefit.heading}>
            <DitchImage image={benefit.image} size={100} />
            <DitchView style={{ width: 180 }}>
              <DitchText text={benefit.heading} fontSizeIndex={1} fontWeightIndex={2} />
              <DitchText text={benefit.text} fontSizeIndex={1} />
            </DitchView>
          </DitchView>
        ))}
      </DitchView>
      <DitchButton
        actionLabel="ACTIVATE"
        actionHandler={() => {
          navigateTo('subscription');
          changeSubscriptionOverlayVisibility(false);
        }}
        style={{ width: 200, margin: 'auto', marginVertical: 10 }}
      />
    </DitchView>
  );
};
export default SubscriptionEndOverlay;
