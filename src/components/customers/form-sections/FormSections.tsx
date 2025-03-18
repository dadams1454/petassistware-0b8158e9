
import React from 'react';
import PersonalInfoFields from '../form-fields/PersonalInfoFields';
import AddressField from '../form-fields/AddressField';
import CustomerTypeFields from '../form-fields/CustomerTypeFields';
import LitterSelectionFields from '../form-fields/LitterSelectionFields';
import InterestedPuppyField from '../form-fields/InterestedPuppyField';
import NotesField from '../form-fields/NotesField';

const FormSections: React.FC = () => {
  return (
    <>
      <PersonalInfoFields />
      <AddressField />
      <CustomerTypeFields />
      <LitterSelectionFields />
      <InterestedPuppyField />
      <NotesField />
    </>
  );
};

export default FormSections;
