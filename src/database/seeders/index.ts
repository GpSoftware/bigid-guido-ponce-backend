import { populateOrganizations } from './organizations';
import { populateUsers } from './users';

export const populateDatabase = async () => {
  await populateOrganizations();
  await populateUsers();
};
