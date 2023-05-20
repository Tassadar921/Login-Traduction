CREATE MIGRATION m1iz4spkuzncbdjxfl2v723j34ekopw7em2ygq3ioydolpgdkruu3q
    ONTO m1elw4askkvijghtolxe2uksrm4ieory6wgtsg66zdwcw5risrdxvq
{
  ALTER TYPE default::Notification {
      ALTER PROPERTY component {
          RENAME TO title;
      };
  };
};
