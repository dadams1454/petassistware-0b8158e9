
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import PuppyCustomerMatcher from '@/components/puppies/matching/PuppyCustomerMatcher';

const PuppyMatching: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PuppyCustomerMatcher />
      </div>
    </PageContainer>
  );
};

export default PuppyMatching;
