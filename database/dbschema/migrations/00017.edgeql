CREATE MIGRATION m1f54quyae7gwbelzrkevhr6y4txojmxenx26o5opnfbfjnn6btqza
    ONTO m1q7ke4plvmh7kjqwpfurffwzm2sdfma6nwj6vc4bl47xz65rajhpq
{
  ALTER TYPE default::Notification {
      CREATE MULTI LINK objectsMessage -> default::Message {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Notification {
      CREATE MULTI LINK objectsUser -> default::User {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Notification {
      ALTER PROPERTY text {
          RENAME TO component;
      };
  };
};
