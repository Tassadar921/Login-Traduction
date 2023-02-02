CREATE MIGRATION m1hcicftwa4bl7xuxwpoauitdbex3rso55tjkwt75r4gynk3n4i4cq
    ONTO m1ujee6mtsq37nbcwliz57tz2k5si3balpfbezy3z2lvs57ypvukoq
{
  CREATE TYPE default::Permission {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY birthdate -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY firstname -> std::str {
          SET REQUIRED USING ('prenom');
      };
      CREATE REQUIRED PROPERTY lastname -> std::str {
          SET REQUIRED USING ('nom');
      };
      CREATE REQUIRED PROPERTY token -> std::str {
          SET REQUIRED USING ('0');
      };
  };
};
