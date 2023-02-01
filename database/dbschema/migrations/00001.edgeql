CREATE MIGRATION m1ujee6mtsq37nbcwliz57tz2k5si3balpfbezy3z2lvs57ypvukoq
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::User {
      CREATE MULTI LINK friends -> default::User;
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY password -> std::str;
      CREATE REQUIRED PROPERTY username -> std::str;
  };
};
