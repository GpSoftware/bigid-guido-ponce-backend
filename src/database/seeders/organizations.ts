import { Organization } from '../models';

const orgs = [
  {
    name: 'Big Id'
  },
];

export const populateOrganizations = () => {
  return Promise.all(
    orgs.map(async org => await Organization.findOrCreate({
      where: {
        name: org.name
      },
      defaults: org
    })),
  );
};