import React, { useState } from 'react';

import { ActionDropdown, Dialog, Heading, SearchBar } from '@douglasneuroinformatics/libui/components';
import { useDownload, useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import type { InstrumentRecordsExport } from '@opendatacapture/schemas/instrument-records';
import type { Subject } from '@opendatacapture/schemas/subject';
import axios from 'axios';
import { unparse } from 'papaparse';
import { useNavigate } from 'react-router-dom';

import { IdentificationForm } from '@/components/IdentificationForm';
import { LoadingFallback } from '@/components/LoadingFallback';
import { PageHeader } from '@/components/PageHeader';
import { useAppStore } from '@/store';
import { downloadExcel } from '@/utils/excel';

import { MasterDataTable } from '../components/MasterDataTable';
import { useSubjectsQuery } from '../hooks/useSubjectsQuery';

export const DataHubPage = () => {
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const currentGroup = useAppStore((store) => store.currentGroup);
  const currentUser = useAppStore((store) => store.currentUser);

  const download = useDownload();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data } = useSubjectsQuery({ params: { groupId: currentGroup?.id } });

  const getExportRecords = async () => {
    const response = await axios.get<InstrumentRecordsExport>('/v1/instrument-records/export', {
      params: {
        groupId: currentGroup?.id
      }
    });
    return response.data;
  };

  const handleExportSelection = (option: 'CSV' | 'Excel' | 'JSON') => {
    const baseFilename = `${currentUser!.username}_${new Date().toISOString()}`;
    switch (option) {
      case 'CSV':
        void download('README.txt', () => t('datahub.index.table.exportHelpText'));
        void download(`${baseFilename}.csv`, async () => {
          const data = await getExportRecords();
          return unparse(data);
        });
        break;
      case 'JSON':
        void download(`${baseFilename}.json`, async () => {
          const data = await getExportRecords();
          return JSON.stringify(data, null, 2);
        });
        break;
      case 'Excel':
        getExportRecords()
          .then((records) => downloadExcel(`${baseFilename}.xlsx`, records))
          .catch(console.error);
    }
  };

  const lookupSubject = async ({ id }: { id: string }) => {
    const response = await axios.get<Subject>(`/v1/subjects/${id}`, {
      validateStatus: (status) => status === 200 || status === 404
    });
    if (response.status === 404) {
      addNotification({ message: t('core.notFound'), type: 'warning' });
      setIsLookupOpen(false);
    } else {
      addNotification({ type: 'success' });
      navigate(`${response.data.id}/assignments`);
    }
  };

  return (
    <React.Fragment>
      <PageHeader>
        <Heading className="text-center" variant="h2">
          {t('datahub.index.title')}
        </Heading>
      </PageHeader>
      <React.Suspense fallback={<LoadingFallback />}>
        <div>
          <div className="mb-3 flex flex-col justify-between gap-3 lg:flex-row">
            <Dialog open={isLookupOpen} onOpenChange={setIsLookupOpen}>
              <Dialog.Trigger className="flex-grow">
                <SearchBar
                  className="[&>input]:text-foreground [&>input]:placeholder-foreground"
                  id="subject-lookup-search-bar"
                  placeholder={t({
                    en: 'Click to Search',
                    fr: 'Cliquer pour rechercher'
                  })}
                  readOnly={true}
                />
              </Dialog.Trigger>
              <Dialog.Content data-spotlight-type="subject-lookup-modal">
                <Dialog.Header>
                  <Dialog.Title>{t('datahub.index.lookup.title')}</Dialog.Title>
                </Dialog.Header>
                <IdentificationForm onSubmit={(data) => void lookupSubject(data)} />
              </Dialog.Content>
            </Dialog>
            <div className="flex min-w-60 gap-2 lg:flex-shrink">
              <ActionDropdown
                widthFull
                data-spotlight-type="export-data-dropdown"
                options={['CSV', 'JSON', 'Excel']}
                title={t('datahub.index.table.export')}
                onSelection={handleExportSelection}
              />
            </div>
          </div>
          <MasterDataTable
            data={data ?? []}
            onSelect={(subject) => {
              navigate(`${subject.id}/assignments`);
            }}
          />
        </div>
      </React.Suspense>
    </React.Fragment>
  );
};
