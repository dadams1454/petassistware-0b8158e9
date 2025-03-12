
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ContractViewer from '@/components/contracts/ContractViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ContractPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Contract ID is required</div>;
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/documents">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
        </Link>
      </div>
      <ContractViewer contractId={id} />
    </MainLayout>
  );
};

export default ContractPage;
