'use client';

import { FlipCardProject } from '@/components/animate-ui/components/community/flip-card';

const data = {
  _id: 'demo-id',
  projectName: 'Animate UI',
  containers: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const FlipCardDemo = () => {
  return <FlipCardProject data={data} onOpen={() => {}} onDelete={() => {}} />;
};
