import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'bbav55bn',
  dataset: 'production',
  useCdn: true, // Use the content delivery network for faster data retrieval (in production).
  apiVersion: '2021-08-31'
});

export default client;