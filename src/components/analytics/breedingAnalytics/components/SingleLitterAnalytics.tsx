
import React, { useState, useEffect } from 'react';
import AnalyticsTabs from './AnalyticsTabs';
import NoLitterSelected from './NoLitterSelected';

interface SingleLitterAnalyticsProps {
  selectedLitter: any | null;
  puppies: any[];
  isLoadingLitters: boolean;
}

const SingleLitterAnalytics: React.FC<SingleLitterAnalyticsProps> = ({ 
  selectedLitter,
  puppies,
  isLoadingLitters
}) => {
  const [innerTabValue, setInnerTabValue] = useState<string>("overview");
  
  // Reset inner tab when selectedLitter changes
  useEffect(() => {
    setInnerTabValue("overview");
  }, [selectedLitter?.id]);

  if (!selectedLitter) {
    return <NoLitterSelected isLoadingLitters={isLoadingLitters} />;
  }

  return (
    <AnalyticsTabs
      puppies={puppies}
      litterName={selectedLitter?.litter_name || 'Litter'}
      tabValue={innerTabValue}
      setTabValue={setInnerTabValue}
    />
  );
};

export default SingleLitterAnalytics;
