CREATE MIGRATION m1ccfxc62cheb5cfajsku6rsiclj2s65chj3wr3vi3vmxzgaotdxga
    ONTO m1iz4spkuzncbdjxfl2v723j34ekopw7em2ygq3ioydolpgdkruu3q
{
  ALTER TYPE default::Notification {
      ALTER PROPERTY title {
          RENAME TO type;
      };
  };
};
