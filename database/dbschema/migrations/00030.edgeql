CREATE MIGRATION m1elw4askkvijghtolxe2uksrm4ieory6wgtsg66zdwcw5risrdxvq
    ONTO m1yjhzq5hj2yeu5wwe6y6bbkvdlvtvosjxbw5diquwkdn3r3cr6d4q
{
  ALTER TYPE default::User {
      ALTER LINK blocked {
          RENAME TO blockedBy;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK blockedUsers -> default::User {
          ON TARGET DELETE ALLOW;
      };
  };
};
