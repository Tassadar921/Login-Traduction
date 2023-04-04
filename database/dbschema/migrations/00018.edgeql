CREATE MIGRATION m1lamd3sqmiedtklv4ihqupwplpupstr5x4dd7iarmgsftryhpxejq
    ONTO m1f54quyae7gwbelzrkevhr6y4txojmxenx26o5opnfbfjnn6btqza
{
  ALTER TYPE default::Notification {
      DROP LINK objectsMessage;
      DROP LINK objectsUser;
      DROP PROPERTY component;
      DROP PROPERTY date;
      DROP PROPERTY seen;
      DROP PROPERTY title;
  };
  ALTER TYPE default::User {
      DROP LINK notifications;
  };
  DROP TYPE default::Notification;
};
