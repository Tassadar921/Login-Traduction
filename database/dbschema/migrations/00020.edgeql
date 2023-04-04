CREATE MIGRATION m1hhjdjzzfl6dwf66ok6a24mp5aspciaa5nzxssjypba52qrtqlmjq
    ONTO m1xlopajfg5fl3yijiveqkdr6tlojpipbsbumvnyonuypp3dacev4a
{
  ALTER TYPE default::Notification {
      ALTER LINK objectsMessage {
          RENAME TO objectMessage;
      };
  };
  ALTER TYPE default::Notification {
      ALTER LINK objectsUser {
          RENAME TO objectUser;
      };
  };
};
